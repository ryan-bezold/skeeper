import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Badge,
    Box,
    Button,
    Container,
    Heading,
    HStack,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Skeleton,
    SkeletonText,
    Text,
    Tooltip,
    useClipboard,
    useDisclosure,
    useToast,
    VStack,
} from '@chakra-ui/react';
import { AddIcon, ArrowBackIcon, CheckIcon, CopyIcon } from '@chakra-ui/icons';
import { MdQrCode2 } from 'react-icons/md';
import { QRCodeSVG } from 'qrcode.react';
import { roomApi } from '@entities/room/api/roomApi.ts';
import { playerApi } from '@entities/player/api/playerApi.ts';
import { Room } from '@entities/room/model/types.ts';
import { Player } from '@entities/player/model/types.ts';
import { PlayerCard } from '@widgets/player-card/ui/PlayerCard.tsx';

function PlayerCardSkeleton() {
    return (
        <Box bg="gray.800" borderWidth={1} borderColor="gray.700" borderRadius="lg" p={4} mb={3}>
            <HStack justify="space-between" mb={4}>
                <Skeleton height="20px" width="35%" />
                <HStack spacing={1}>
                    <Skeleton boxSize="32px" borderRadius="md" />
                    <Skeleton boxSize="32px" borderRadius="md" />
                </HStack>
            </HStack>
            <VStack spacing={3} mb={4}>
                <Skeleton height="64px" width="80px" />
                <HStack spacing={2}>
                    <Skeleton height="32px" width="52px" />
                    <Skeleton height="40px" width="60px" />
                    <Skeleton height="40px" width="60px" />
                    <Skeleton height="32px" width="52px" />
                </HStack>
            </VStack>
            <SkeletonText noOfLines={1} width="30%" />
        </Box>
    );
}

export function RoomPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const toast = useToast();

    const [room, setRoom] = useState<Room | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [isLoadingRoom, setIsLoadingRoom] = useState(true);
    const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [isAddingPlayer, setIsAddingPlayer] = useState(false);

    const newPlayerInputRef = useRef<HTMLInputElement>(null);

    const { onCopy, hasCopied } = useClipboard(room?.shareCode ?? '');
    const { isOpen: isQrOpen, onOpen: onQrOpen, onClose: onQrClose } = useDisclosure();

    useEffect(() => {
        if (!id) return;

        const fetchRoom = async () => {
            setIsLoadingRoom(true);
            try {
                const data = await roomApi.getById(id);
                setRoom(data);
            } catch {
                toast({ title: 'Failed to load room', status: 'error', duration: 3000, isClosable: true });
            } finally {
                setIsLoadingRoom(false);
            }
        };

        const fetchPlayers = async () => {
            setIsLoadingPlayers(true);
            try {
                const data = await playerApi.getByRoomId(id);
                setPlayers(data);
            } catch {
                toast({ title: 'Failed to load players', status: 'error', duration: 3000, isClosable: true });
            } finally {
                setIsLoadingPlayers(false);
            }
        };

        fetchRoom();
        fetchPlayers();
    }, [id, toast]);

    const handleAddPlayer = async () => {
        const name = newPlayerName.trim();
        if (!name || !id) return;

        setIsAddingPlayer(true);
        try {
            const player = await playerApi.create(id, { name });
            setPlayers((prev) => [...prev, player]);
            setNewPlayerName('');
            newPlayerInputRef.current?.focus();
        } catch {
            toast({ title: 'Failed to add player', status: 'error', duration: 3000, isClosable: true });
        } finally {
            setIsAddingPlayer(false);
        }
    };

    const handleDeletePlayer = useCallback((playerId: string) => {
        setPlayers((prev) => prev.filter((p) => p.id !== playerId));
    }, []);

    const handleRenamePlayer = useCallback((playerId: string, name: string) => {
        setPlayers((prev) => prev.map((p) => p.id === playerId ? { ...p, name } : p));
    }, []);

    const handleScoreUpdate = useCallback((playerId: string, score: number) => {
        setPlayers((prev) => prev.map((p) => p.id === playerId ? { ...p, score } : p));
    }, []);

    const roomUrl = `${window.location.origin}/rooms/${id}`;

    return (
        <Box minH="100vh" bg="gray.900">
            <Container maxW="container.md" py={{ base: 4, md: 8 }}>
                <VStack align="stretch" spacing={{ base: 6, md: 8 }}>

                    {/* Back button */}
                    <Box>
                        <Button
                            leftIcon={<ArrowBackIcon />}
                            variant="ghost"
                            colorScheme="gray"
                            size="sm"
                            onClick={() => navigate('/')}
                            px={0}
                            _hover={{ color: 'white' }}
                        >
                            All Rooms
                        </Button>
                    </Box>

                    {/* Room header */}
                    <Box>
                        {isLoadingRoom ? (
                            <>
                                <Skeleton height="36px" width="50%" mb={3} />
                                <Skeleton height="28px" width="160px" />
                            </>
                        ) : room ? (
                            <>
                                <Heading size={{ base: 'lg', md: 'xl' }} mb={3}>
                                    {room.name}
                                </Heading>
                                <HStack spacing={2} flexWrap="wrap">
                                    <Text fontSize="sm" color="gray.400">Share code:</Text>
                                    <Badge
                                        colorScheme="brand"
                                        variant="subtle"
                                        fontSize="sm"
                                        letterSpacing="widest"
                                        fontFamily="mono"
                                        px={2}
                                        py={1}
                                    >
                                        {room.shareCode}
                                    </Badge>
                                    <Tooltip label={hasCopied ? 'Copied!' : 'Copy code'} placement="top" hasArrow>
                                        <IconButton
                                            aria-label="Copy share code"
                                            icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
                                            size="xs"
                                            variant="ghost"
                                            colorScheme={hasCopied ? 'green' : 'gray'}
                                            onClick={onCopy}
                                        />
                                    </Tooltip>
                                    <Tooltip label="Show QR code" placement="top" hasArrow>
                                        <IconButton
                                            aria-label="Show QR code"
                                            icon={<MdQrCode2 />}
                                            size="xs"
                                            variant="ghost"
                                            colorScheme="gray"
                                            onClick={onQrOpen}
                                        />
                                    </Tooltip>
                                </HStack>
                            </>
                        ) : (
                            <Text color="gray.500">Room not found.</Text>
                        )}
                    </Box>

                    {/* Players section */}
                    <Box>
                        <HStack justify="space-between" align="center" mb={4}>
                            <Heading size={{ base: 'md', md: 'lg' }}>
                                Players
                            </Heading>
                            {!isLoadingPlayers && (
                                <Text fontSize="sm" color="gray.500">
                                    {players.length} {players.length === 1 ? 'player' : 'players'}
                                </Text>
                            )}
                        </HStack>

                        {/* Add player form */}
                        <HStack mb={4}>
                            <Input
                                ref={newPlayerInputRef}
                                placeholder="Player name"
                                value={newPlayerName}
                                onChange={(e) => setNewPlayerName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
                                bg="gray.800"
                                borderColor="gray.700"
                                _hover={{ borderColor: 'gray.600' }}
                                _focus={{ borderColor: 'brand.400', boxShadow: 'none' }}
                                isDisabled={isAddingPlayer}
                            />
                            <Button
                                leftIcon={<AddIcon />}
                                colorScheme="brand"
                                onClick={handleAddPlayer}
                                isLoading={isAddingPlayer}
                                isDisabled={!newPlayerName.trim()}
                                flexShrink={0}
                            >
                                Add
                            </Button>
                        </HStack>

                        {/* Player list */}
                        {isLoadingPlayers && (
                            <>
                                <PlayerCardSkeleton />
                                <PlayerCardSkeleton />
                            </>
                        )}

                        {!isLoadingPlayers && players.length === 0 && (
                            <Text color="gray.500">
                                No players yet. Add one to get started!
                            </Text>
                        )}

                        {!isLoadingPlayers && players.map((player) => (
                            <PlayerCard
                                key={player.id}
                                player={player}
                                onDelete={handleDeletePlayer}
                                onRename={handleRenamePlayer}
                                onScoreUpdate={handleScoreUpdate}
                            />
                        ))}
                    </Box>
                </VStack>
            </Container>

            {/* QR Code modal */}
            <Modal isOpen={isQrOpen} onClose={onQrClose} isCentered size="xs">
                <ModalOverlay />
                <ModalContent bg="gray.800" borderWidth={1} borderColor="gray.700">
                    <ModalHeader>Share Room</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <VStack spacing={4}>
                            <Box bg="white" p={4} borderRadius="md">
                                <QRCodeSVG value={roomUrl} size={200} />
                            </Box>
                            <VStack spacing={1}>
                                <Text fontSize="sm" color="gray.400">Share code</Text>
                                <Text
                                    fontFamily="mono"
                                    fontSize="2xl"
                                    fontWeight="bold"
                                    letterSpacing="widest"
                                >
                                    {room?.shareCode}
                                </Text>
                            </VStack>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
}
