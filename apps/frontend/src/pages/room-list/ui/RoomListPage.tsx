import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { roomApi } from '@entities/room/api/roomApi';

export function RoomListPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRoom = async () => {
    setIsCreating(true);
    try {
      const room = await roomApi.create({ name: 'New Game Room' });
      navigate(`/rooms/${room.id}`);
    } catch (error) {
      console.error('Failed to create room:', error);
      toast({
        title: 'Error',
        description: 'Failed to create room. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsCreating(false);
    }
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
            <Heading size={{ base: 'md', md: 'lg' }} mb={4}>
              Your Rooms
            </Heading>
            <Text color="gray.500">
              No rooms yet. Create one to get started!
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
