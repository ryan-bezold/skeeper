import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    InputGroup,
    InputLeftElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Skeleton,
    SkeletonText,
    Text,
    useDisclosure,
    useToast,
    VStack,
} from '@chakra-ui/react';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import { MdQrCodeScanner } from 'react-icons/md';
import { useRoomStore } from '@entities/room/model/roomStore';
import { RoomCard } from '@widgets/room-card/ui/RoomCard.tsx';

function RoomCardSkeleton() {
    return (
        <Box bg="gray.800" borderWidth={1} borderColor="gray.700" borderRadius="lg" px={5} py={4} mb={3}>
            <HStack justify="space-between">
                <VStack align="start" spacing={2} flex={1}>
                    <Skeleton height="18px" width="40%" />
                    <SkeletonText noOfLines={1} width="60%" skeletonHeight="12px" />
                </VStack>
                <Skeleton boxSize="20px" />
            </HStack>
        </Box>
    );
}

export function RoomListPage() {
    const navigate = useNavigate();
    const toast = useToast();

    const rooms = useRoomStore((s) => s.rooms);
    const isLoadingRooms = useRoomStore((s) => s.isLoadingRooms);
    const isCreating = useRoomStore((s) => s.isCreating);
    const fetchRooms = useRoomStore((s) => s.fetchRooms);
    const createRoom = useRoomStore((s) => s.createRoom);
    const joinByShareCode = useRoomStore((s) => s.joinByShareCode);

    const [search, setSearch] = useState('');
    const { isOpen: isJoinOpen, onOpen: onJoinOpen, onClose: onJoinClose } = useDisclosure();
    const [joinCode, setJoinCode] = useState('');
    const [isJoining, setIsJoining] = useState(false);

    const filteredRooms = rooms.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase()),
    );

    useEffect(() => {
        fetchRooms().catch(() => {
            toast({
                title: 'Failed to load rooms',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        });
    }, [fetchRooms, toast]);

    const handleCreateRoom = async () => {
        try {
            const room = await createRoom();
            navigate(`/rooms/${room.id}`);
        } catch {
            toast({
                title: 'Failed to create room',
                description: 'Please try again.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleJoinRoom = async () => {
        const code = joinCode.trim();
        if (!code) return;

        setIsJoining(true);
        try {
            const room = await joinByShareCode(code);
            onJoinClose();
            setJoinCode('');
            navigate(`/rooms/${room.id}`);
        } catch {
            toast({
                title: 'Room not found',
                description: 'Check the share code and try again.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsJoining(false);
        }
    };

    const handleDelete = (_id: string) => {
        toast({ title: 'Room deleted', status: 'success', duration: 2000, isClosable: true });
        // Store already updated optimistically in RoomCard
    };

    const handleRename = (_id: string, _name: string) => {
        toast({ title: 'Room renamed', status: 'success', duration: 2000, isClosable: true });
        // Store already updated optimistically in RoomCard
    };

    return (
        <Box minH="100vh" bg="gray.900">
            <Container maxW="container.xl" py={{ base: 4, md: 8 }}>
                <VStack align="stretch" spacing={{ base: 6, md: 8 }}>
                    <Box>
                        <Heading size={{ base: 'xl', md: '2xl' }} mb={2}>
                            Skeeper
                        </Heading>
                        <Text color="gray.400" fontSize={{ base: 'md', md: 'lg' }}>
                            Track scores in your games
                        </Text>
                    </Box>

                    <HStack spacing={3} flexWrap="wrap">
                        <Button
                            leftIcon={<AddIcon />}
                            colorScheme="brand"
                            size="lg"
                            onClick={handleCreateRoom}
                            isLoading={isCreating}
                            loadingText="Creating..."
                            w={{ base: 'full', sm: 'fit-content' }}
                        >
                            Create New Room
                        </Button>
                        <Button
                            leftIcon={<MdQrCodeScanner />}
                            variant="outline"
                            colorScheme="gray"
                            size="lg"
                            onClick={onJoinOpen}
                            w={{ base: 'full', sm: 'fit-content' }}
                        >
                            Join via Code
                        </Button>
                    </HStack>

                    <Box>
                        <HStack justify="space-between" align="center" mb={4}>
                            <Heading size={{ base: 'md', md: 'lg' }}>
                                Your Rooms
                            </Heading>
                            {!isLoadingRooms && rooms.length > 0 && (
                                <Text fontSize="sm" color="gray.500">
                                    {filteredRooms.length} of {rooms.length}
                                </Text>
                            )}
                        </HStack>

                        {!isLoadingRooms && rooms.length > 1 && (
                            <InputGroup mb={4}>
                                <InputLeftElement pointerEvents="none">
                                    <SearchIcon color="gray.500" />
                                </InputLeftElement>
                                <Input
                                    placeholder="Search rooms..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    bg="gray.800"
                                    borderColor="gray.700"
                                    _hover={{ borderColor: 'gray.600' }}
                                    _focus={{ borderColor: 'brand.400', boxShadow: 'none' }}
                                />
                            </InputGroup>
                        )}

                        {isLoadingRooms && rooms.length === 0 && (
                            <>
                                <RoomCardSkeleton />
                                <RoomCardSkeleton />
                                <RoomCardSkeleton />
                            </>
                        )}

                        {!isLoadingRooms && rooms.length === 0 && (
                            <Text color="gray.500">No rooms yet. Create one to get started!</Text>
                        )}

                        {!isLoadingRooms && rooms.length > 0 && filteredRooms.length === 0 && (
                            <Text color="gray.500">No rooms match "{search}".</Text>
                        )}

                        {filteredRooms.map((room) => (
                            <RoomCard
                                key={room.id}
                                room={room}
                                onDelete={handleDelete}
                                onRename={handleRename}
                            />
                        ))}
                    </Box>
                </VStack>
            </Container>

            {/* Join by Share Code modal */}
            <Modal isOpen={isJoinOpen} onClose={() => { onJoinClose(); setJoinCode(''); }} isCentered size="sm">
                <ModalOverlay />
                <ModalContent bg="gray.800" borderWidth={1} borderColor="gray.700">
                    <ModalHeader>Join Room</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel color="gray.400" fontSize="sm">Enter share code</FormLabel>
                            <Input
                                placeholder="e.g. a1b2c3d4"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
                                bg="gray.700"
                                borderColor="gray.600"
                                fontFamily="mono"
                                letterSpacing="widest"
                                autoFocus
                                _hover={{ borderColor: 'gray.500' }}
                                _focus={{ borderColor: 'brand.400', boxShadow: 'none' }}
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={() => { onJoinClose(); setJoinCode(''); }}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="brand"
                            onClick={handleJoinRoom}
                            isLoading={isJoining}
                            loadingText="Joining..."
                            isDisabled={!joinCode.trim()}
                        >
                            Join Room
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}
