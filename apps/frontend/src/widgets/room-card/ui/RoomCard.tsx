import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Badge,
    Box,
    Button,
    HStack,
    IconButton,
    Input,
    Text,
    Tooltip,
    useClipboard,
    useDisclosure,
    useToast,
    VStack,
} from '@chakra-ui/react';
import { CheckIcon, ChevronRightIcon, CopyIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { BsPeople } from 'react-icons/bs';
import { Room } from '@entities/room/model/types.ts';
import { roomApi } from '@entities/room/api/roomApi.ts';

interface RoomCardProps {
    room: Room;
    onDelete: (id: string) => void;
    onRename: (id: string, name: string) => void;
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export function RoomCard({ room, onDelete, onRename }: RoomCardProps) {
    const navigate = useNavigate();
    const toast = useToast();
    const { onCopy, hasCopied } = useClipboard(room.shareCode);

    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(room.name);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);

    const handleRenameSubmit = async () => {
        const trimmed = editName.trim();
        if (!trimmed || trimmed === room.name) {
            setEditName(room.name);
            setIsEditing(false);
            return;
        }
        setIsSaving(true);
        try {
            await roomApi.update(room.id, { name: trimmed });
            onRename(room.id, trimmed);
            setIsEditing(false);
        } catch {
            toast({ title: 'Failed to rename room', status: 'error', duration: 3000, isClosable: true });
            setEditName(room.name);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await roomApi.delete(room.id);
            onDelete(room.id);
            onDeleteClose();
        } catch {
            toast({ title: 'Failed to delete room', status: 'error', duration: 3000, isClosable: true });
            setIsDeleting(false);
        }
    };

    return (
        <>
            <Box
                bg="gray.800"
                borderWidth={1}
                borderColor="gray.700"
                borderRadius="lg"
                px={5}
                py={4}
                mb={3}
                cursor={isEditing ? 'default' : 'pointer'}
                _hover={isEditing ? {} : { borderColor: 'brand.400', bg: 'gray.750' }}
                transition="border-color 0.15s, background 0.15s"
                onClick={() => !isEditing && navigate(`/rooms/${room.id}`)}
            >
                <HStack justify="space-between" align="center" spacing={3}>
                    <VStack align="start" spacing={1} minW={0} flex={1}>
                        {isEditing ? (
                            <HStack w="full" onClick={(e) => e.stopPropagation()}>
                                <Input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleRenameSubmit();
                                        if (e.key === 'Escape') {
                                            setEditName(room.name);
                                            setIsEditing(false);
                                        }
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
                                    icon={<ChevronRightIcon transform="rotate(270deg)" />}
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="gray"
                                    onClick={() => { setEditName(room.name); setIsEditing(false); }}
                                    isDisabled={isSaving}
                                />
                            </HStack>
                        ) : (
                            <Text fontWeight="bold" fontSize="md" color="white" noOfLines={1}>
                                {room.name}
                            </Text>
                        )}

                        <HStack spacing={3} flexWrap="wrap">
                            {room.playerCount !== undefined && (
                                <HStack spacing={1} color="gray.400">
                                    <BsPeople size={13} />
                                    <Text fontSize="xs">{room.playerCount}</Text>
                                </HStack>
                            )}
                            <HStack spacing={1}>
                                <Badge
                                    colorScheme="brand"
                                    variant="subtle"
                                    fontSize="xs"
                                    letterSpacing="widest"
                                    fontFamily="mono"
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
                                        onClick={(e) => { e.stopPropagation(); onCopy(); }}
                                    />
                                </Tooltip>
                            </HStack>
                            <Text fontSize="xs" color="gray.500">
                                {formatDate(room.createdAt)}
                            </Text>
                        </HStack>
                    </VStack>

                    <HStack spacing={1} onClick={(e) => e.stopPropagation()} flexShrink={0}>
                        {!isEditing && (
                            <Tooltip label="Rename" placement="top" hasArrow>
                                <IconButton
                                    aria-label="Rename room"
                                    icon={<EditIcon />}
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="gray"
                                    onClick={() => setIsEditing(true)}
                                />
                            </Tooltip>
                        )}
                        <Tooltip label="Delete" placement="top" hasArrow>
                            <IconButton
                                aria-label="Delete room"
                                icon={<DeleteIcon />}
                                size="sm"
                                variant="ghost"
                                colorScheme="red"
                                onClick={onDeleteOpen}
                            />
                        </Tooltip>
                        {!isEditing && <ChevronRightIcon boxSize={5} color="gray.500" />}
                    </HStack>
                </HStack>
            </Box>

            <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef} onClose={onDeleteClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent bg="gray.800" borderWidth={1} borderColor="gray.700">
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Room
                        </AlertDialogHeader>
                        <AlertDialogBody color="gray.300">
                            Delete <Text as="span" color="white" fontWeight="semibold">"{room.name}"</Text>?
                            This will remove all players and scores. This cannot be undone.
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
