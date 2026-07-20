import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Tooltip,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { AddIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { playerApi } from '@entities/player/api/playerApi';
import { Player } from '@entities/player/model/types';
import { PlayerSummaryView } from '@widgets/player-summary';

export function RoomPage() {
  const { id } = useParams<{ id: string }>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSummaryMode, setIsSummaryMode] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!id) return;

    const fetchPlayers = async () => {
      setIsLoading(true);
      try {
        const data = await playerApi.getByRoomId(id);
        setPlayers(data);
      } catch (error) {
        console.error('Failed to fetch players:', error);
        toast({
          title: 'Error',
          description: 'Failed to load players',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayers();
  }, [id, toast]);

  return (
    <Box minH="100vh" bg="gray.900">
      <Container maxW="container.xl" py={{ base: 4, md: 8 }}>
        <VStack align="stretch" spacing={{ base: 6, md: 8 }}>
          <HStack justify="space-between" align="flex-start">
            <Box>
              <Heading size={{ base: 'lg', md: 'xl' }} mb={2}>
                Game Room
              </Heading>
              <Text color="gray.400" fontSize={{ base: 'sm', md: 'md' }}>
                Room ID: {id}
              </Text>
            </Box>
            <Tooltip
              label={isSummaryMode ? 'Show full view' : 'Show score summary'}
              placement="left"
            >
              <Button
                aria-label={isSummaryMode ? 'Show full view' : 'Show score summary'}
                leftIcon={isSummaryMode ? <ViewOffIcon /> : <ViewIcon />}
                variant="outline"
                colorScheme="brand"
                size="sm"
                onClick={() => setIsSummaryMode((prev) => !prev)}
              >
                {isSummaryMode ? 'Full View' : 'Summary'}
              </Button>
            </Tooltip>
          </HStack>

          {isSummaryMode ? (
            <Box
              bg="gray.800"
              borderRadius="lg"
              borderWidth={1}
              borderColor="gray.700"
              overflow="hidden"
            >
              <Box
                px={{ base: 3, md: 4 }}
                py={{ base: 2, md: 3 }}
                bg="gray.750"
                borderBottomWidth={1}
                borderColor="gray.700"
              >
                <Heading size="sm" color="gray.300">
                  Score Summary
                </Heading>
              </Box>
              {isLoading ? (
                <Box textAlign="center" py={6}>
                  <Spinner size="md" />
                </Box>
              ) : (
                <PlayerSummaryView players={players} />
              )}
            </Box>
          ) : (
            <Box>
              <Heading size={{ base: 'md', md: 'lg' }} mb={4}>
                Players
              </Heading>
              {isLoading ? (
                <Box textAlign="center" py={8}>
                  <Spinner size="lg" />
                </Box>
              ) : players.length === 0 ? (
                <Text color="gray.500" mb={4}>
                  No players yet. Add one to get started!
                </Text>
              ) : (
                <VStack align="stretch" spacing={3} mb={4}>
                  {players.map((player) => (
                    <Box
                      key={player.id}
                      p={{ base: 3, md: 4 }}
                      bg="gray.800"
                      borderRadius="md"
                      borderWidth={1}
                      borderColor="gray.700"
                    >
                      <HStack justify="space-between">
                        <Text fontWeight="semibold">{player.name}</Text>
                        <Text fontSize="lg" fontWeight="bold" color="brand.300">
                          {player.score}
                        </Text>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              )}
              <Button
                leftIcon={<AddIcon />}
                colorScheme="green"
                size="md"
                w={{ base: 'full', sm: 'fit-content' }}
              >
                Add Player
              </Button>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
