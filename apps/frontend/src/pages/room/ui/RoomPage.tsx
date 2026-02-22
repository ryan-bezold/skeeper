import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

export function RoomPage() {
  const { id } = useParams<{ id: string }>();

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
            <Button
              leftIcon={<AddIcon />}
              colorScheme="green"
              size="md"
              w={{ base: 'full', sm: 'fit-content' }}
            >
              Add Player
            </Button>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
