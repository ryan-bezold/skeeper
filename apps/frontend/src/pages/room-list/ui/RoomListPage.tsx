import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    Heading,
    HStack,
    Input,
    InputGroup,
    InputLeftElement,
    Skeleton,
    SkeletonText,
    Text,
    useToast,
    VStack,
} from '@chakra-ui/react';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import { roomApi } from '@entities/room/api/roomApi';
import { Room } from '@entities/room/model/types.ts';
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

    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [search, setSearch] = useState('');

    const filteredRooms = rooms.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase()),
    );

    const handleCreateRoom = async () => {
        setIsCreating(true);
        try {
            const room = await roomApi.create({ name: 'New Game Room' });
            navigate(`/rooms/${room.id}`);
        } catch {
            toast({
                title: 'Failed to create room',
                description: 'Please try again.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = useCallback((id: string) => {
        setRooms((prev) => prev.filter((r) => r.id !== id));
        toast({ title: 'Room deleted', status: 'success', duration: 2000, isClosable: true });
    }, [toast]);

    const handleRename = useCallback((id: string, name: string) => {
        setRooms((prev) => prev.map((r) => r.id === id ? { ...r, name } : r));
        toast({ title: 'Room renamed', status: 'success', duration: 2000, isClosable: true });
    }, [toast]);

    useEffect(() => {
        const fetchRooms = async () => {
            setIsLoading(true);
            try {
                const data = await roomApi.getAll();
                setRooms(data);
            } catch {
                toast({
                    title: 'Failed to load rooms',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchRooms();
    }, [toast]);

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

                    <Box>
                        <HStack justify="space-between" align="center" mb={4}>
                            <Heading size={{ base: 'md', md: 'lg' }}>
                                Your Rooms
                            </Heading>
                            {!isLoading && rooms.length > 0 && (
                                <Text fontSize="sm" color="gray.500">
                                    {filteredRooms.length} of {rooms.length}
                                </Text>
                            )}
                        </HStack>

                        {!isLoading && rooms.length > 1 && (
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

                        {isLoading && (
                            <>
                                <RoomCardSkeleton />
                                <RoomCardSkeleton />
                                <RoomCardSkeleton />
                            </>
                        )}

                        {!isLoading && rooms.length === 0 && (
                            <Text color="gray.500">No rooms yet. Create one to get started!</Text>
                        )}

                        {!isLoading && rooms.length > 0 && filteredRooms.length === 0 && (
                            <Text color="gray.500">No rooms match "{search}".</Text>
                        )}

                        {!isLoading && filteredRooms.map((room) => (
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
        </Box>
    );
}
