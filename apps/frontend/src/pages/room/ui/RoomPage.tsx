import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { playerApi } from '@entities/player/api/playerApi';

export function RoomPage() {
  const { id } = useParams<{ id: string }>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();
  const [isResetting, setIsResetting] = useState(false);

  const handleResetScores = async () => {
    if (!id) return;
    setIsResetting(true);
    try {
      await playerApi.resetScores(id);
      toast({
        title: 'Scores reset',
        description: 'All player scores have been reset to zero.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Failed to reset scores:', error);
      toast({
        title: 'Error',
        description: 'Failed to reset scores. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsResetting(false);
      onClose();
    }
  };

  return (
    <Box minH="100vh" bg="gray.900">
      <Container maxW="container.xl" py={{ base: 4, md: 8 }}>
        <VStack align="stretch" spacing={{ base: 6, md: 8 }}>
          <Box>
            <Heading size={{ base: 'lg', md: 'xl' }} mb={2}>
              Game Room
            </Heading>
            <Text color="gray.400" fontSize={{ base: 'sm', md: 'md' }}>
              Room ID: {id}
            </Text>
          </Box>

          <Box>
            <Heading size={{ base: 'md', md: 'lg' }} mb={4}>
              Players
            </Heading>
            <VStack align="stretch" spacing={3}>
              <Button
                leftIcon={<AddIcon />}
                colorScheme="green"
                size="md"
                w={{ base: 'full', sm: 'fit-content' }}
              >
                Add Player
              </Button>
              <Button
                colorScheme="red"
                variant="outline"
                size="md"
                w={{ base: 'full', sm: 'fit-content' }}
                onClick={onOpen}
              >
                Reset All Scores
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="gray.800" borderColor="gray.700">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Reset All Scores
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to reset all player scores to zero? This
              action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} variant="ghost">
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleResetScores}
                isLoading={isResetting}
                loadingText="Resetting..."
                ml={3}
              >
                Reset
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
