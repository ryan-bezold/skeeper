import { useCallback, useEffect, useRef, useState } from 'react';
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    HStack,
    IconButton,
    Input,
    Text,
    Tooltip,
    useDisclosure,
    useToast,
    VStack,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { Player } from '@entities/player/model/types.ts';
import { playerApi } from '@entities/player/api/playerApi.ts';
import { wsClient } from '@shared/api/websocket.ts';
import { ScoreHistoryList } from '@widgets/score-history/ui/ScoreHistoryList.tsx';
import { ScoreControls } from '@features/score-management';

interface ScoreChangedEvent {
    playerId: string;
    newScore: number;
}

interface PlayerCardProps {
    player: Player;
    onDelete: (id: string) => void;
    onRename: (id: string, name: string) => void;
    onScoreUpdate: (id: string, score: number) => void;
}

export function PlayerCard({ player, onDelete, onRename, onScoreUpdate }: PlayerCardProps) {
    const toast = useToast();

    const [score, setScore] = useState(player.score);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(player.name);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdatingScore, setIsUpdatingScore] = useState(false);
    const [historyKey, setHistoryKey] = useState(0);
    const [animKey, setAnimKey] = useState(0);
    const [animationType, setAnimationType] = useState<'increment' | 'decrement' | null>(null);

    const animTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        return () => clearTimeout(animTimeoutRef.current);
    }, []);

    // Keep local score in sync if parent re-renders with updated player
    useEffect(() => {
        setScore(player.score);
    }, [player.score]);

    const triggerAnimation = (type: 'increment' | 'decrement') => {
        clearTimeout(animTimeoutRef.current);
        setAnimationType(type);
        setAnimKey((k) => k + 1);
        animTimeoutRef.current = setTimeout(() => setAnimationType(null), 600);
    };

    // Real-time score updates via WebSocket
    const handleScoreChanged = useCallback((event: ScoreChangedEvent) => {
        if (event.playerId === player.id) {
            setScore((prev) => {
                if (event.newScore !== prev) {
                    triggerAnimation(event.newScore > prev ? 'increment' : 'decrement');
                }
                return event.newScore;
            });
            onScoreUpdate(player.id, event.newScore);
            setHistoryKey((k) => k + 1);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [player.id, onScoreUpdate]);

    useEffect(() => {
        const socket = wsClient.connect();
        socket.emit('subscribe_to_player', { playerId: player.id });
        socket.on('score_changed', handleScoreChanged);

        return () => {
            socket.off('score_changed', handleScoreChanged);
            socket.emit('unsubscribe_from_player', { playerId: player.id });
        };
    }, [player.id, handleScoreChanged]);

    const handleScoreAdjust = async (operation: 'increment' | 'decrement' | 'set', value: number) => {
        if (isUpdatingScore) return;
        setIsUpdatingScore(true);

        const prevScore = score;
        const newScore =
            operation === 'increment' ? score + value :
            operation === 'decrement' ? score - value :
            value;

        if (newScore !== prevScore) {
            triggerAnimation(newScore > prevScore ? 'increment' : 'decrement');
        }

        // Optimistic update
        setScore(newScore);

        try {
            await playerApi.updateScore(player.id, { operation, value });
            // WS event will confirm the actual new score
        } catch {
            setScore(prevScore);
            setAnimationType(null);
            toast({ title: 'Failed to update score', status: 'error', duration: 3000, isClosable: true });
        } finally {
            setIsUpdatingScore(false);
        }
    };

    const handleRenameSubmit = async () => {
        const trimmed = editName.trim();
        if (!trimmed || trimmed === player.name) {
            setEditName(player.name);
            setIsEditing(false);
            return;
        }
        setIsSaving(true);
        try {
            await playerApi.update(player.id, { name: trimmed });
            onRename(player.id, trimmed);
            setIsEditing(false);
        } catch {
            toast({ title: 'Failed to rename player', status: 'error', duration: 3000, isClosable: true });
            setEditName(player.name);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await playerApi.delete(player.id);
            onDelete(player.id);
            onDeleteClose();
        } catch {
            toast({ title: 'Failed to delete player', status: 'error', duration: 3000, isClosable: true });
            setIsDeleting(false);
        }
    };

    const scoreColor =
        animationType === 'increment' ? 'green.300' :
        animationType === 'decrement' ? 'red.300' :
        'white';

    return (
        <>
            <Box bg="gray.800" borderWidth={1} borderColor="gray.700" borderRadius="lg" p={4} mb={3}>
                {/* Header: name + actions */}
                <HStack justify="space-between" mb={4}>
                    {isEditing ? (
                        <HStack flex={1} onClick={(e) => e.stopPropagation()}>
                            <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleRenameSubmit();
                                    if (e.key === 'Escape') { setEditName(player.name); setIsEditing(false); }
                                }}
                                autoFocus
                                size="sm"
                                fontWeight="bold"
                                bg="gray.700"
                                borderColor="brand.400"
                                _focus={{ borderColor: 'brand.300', boxShadow: 'none' }}
                                isDisabled={isSaving}
                            />
                            <IconButton
                                aria-label="Save name"
                                icon={<CheckIcon />}
                                size="sm"
                                colorScheme="brand"
                                onClick={handleRenameSubmit}
                                isLoading={isSaving}
                            />
                            <IconButton
                                aria-label="Cancel edit"
                                icon={<CloseIcon />}
                                size="sm"
                                variant="ghost"
                                colorScheme="gray"
                                onClick={() => { setEditName(player.name); setIsEditing(false); }}
                                isDisabled={isSaving}
                            />
                        </HStack>
                    ) : (
                        <Text fontWeight="bold" fontSize="lg" color="white" noOfLines={1}>
                            {player.name}
                        </Text>
                    )}
                    <HStack spacing={1} flexShrink={0}>
                        {!isEditing && (
                            <Tooltip label="Rename" placement="top" hasArrow>
                                <IconButton
                                    aria-label="Rename player"
                                    icon={<EditIcon />}
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="gray"
                                    onClick={() => setIsEditing(true)}
                                />
                            </Tooltip>
                        )}
                        <Tooltip label="Delete player" placement="top" hasArrow>
                            <IconButton
                                aria-label="Delete player"
                                icon={<DeleteIcon />}
                                size="sm"
                                variant="ghost"
                                colorScheme="red"
                                onClick={onDeleteOpen}
                            />
                        </Tooltip>
                    </HStack>
                </HStack>

                {/* Score display + controls */}
                <VStack spacing={3} mb={4}>
                    <motion.div
                        key={animKey}
                        initial={animKey === 0 ? false : { scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        style={{ display: 'inline-block' }}
                    >
                        <Text
                            fontSize="6xl"
                            fontWeight="black"
                            lineHeight={1}
                            color={scoreColor}
                            transition="color 0.4s ease"
                            sx={{ fontVariantNumeric: 'tabular-nums' }}
                        >
                            {score}
                        </Text>
                    </motion.div>

                    <ScoreControls isLoading={isUpdatingScore} onAdjust={handleScoreAdjust} />
                </VStack>

                {/* Score history accordion */}
                <Accordion allowToggle>
                    <AccordionItem border="none">
                        <AccordionButton
                            px={0}
                            py={2}
                            _hover={{ bg: 'transparent' }}
                            color="gray.400"
                            fontSize="sm"
                            onClick={() => setHistoryKey((k) => k + 1)}
                        >
                            <Box flex={1} textAlign="left">Score History</Box>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel px={0} pt={2}>
                            <ScoreHistoryList key={historyKey} playerId={player.id} />
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            </Box>

            <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef} onClose={onDeleteClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent bg="gray.800" borderWidth={1} borderColor="gray.700">
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Player
                        </AlertDialogHeader>
                        <AlertDialogBody color="gray.300">
                            Delete{' '}
                            <Text as="span" color="white" fontWeight="semibold">
                                "{player.name}"
                            </Text>
                            ? Their score history will also be removed. This cannot be undone.
                        </AlertDialogBody>
                        <AlertDialogFooter gap={3}>
                            <Button ref={cancelRef} onClick={onDeleteClose} variant="ghost">
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={handleDelete} isLoading={isDeleting}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}
