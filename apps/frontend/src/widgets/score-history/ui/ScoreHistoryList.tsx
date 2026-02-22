import { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  Text,
  Badge,
  HStack,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons';
import { ScoreHistory } from '@entities/score-history/model/types';
import { scoreHistoryApi } from '@entities/score-history/api/scoreHistoryApi';

interface ScoreHistoryListProps {
  playerId?: string;
  roomId?: string;
}

export function ScoreHistoryList({ playerId, roomId }: ScoreHistoryListProps) {
  const [history, setHistory] = useState<ScoreHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        if (playerId) {
          const data = await scoreHistoryApi.getByPlayerId(playerId);
          setHistory(data);
        } else if (roomId) {
          const data = await scoreHistoryApi.getByRoomId(roomId);
          setHistory(data);
        }
      } catch (error) {
        console.error('Failed to fetch score history:', error);
        toast({
          title: 'Error',
          description: 'Failed to load score history',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [playerId, roomId, toast]);

  if (isLoading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="lg" />
      </Box>
    );
  }

  if (history.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="gray.500">No score changes yet</Text>
      </Box>
    );
  }

  const getChangeIcon = (changeAmount: number) => {
    if (changeAmount > 0) {
      return <ArrowUpIcon color="green.400" />;
    } else if (changeAmount < 0) {
      return <ArrowDownIcon color="red.400" />;
    }
    return null;
  };

  const getChangeColor = (changeAmount: number) => {
    if (changeAmount > 0) return 'green';
    if (changeAmount < 0) return 'red';
    return 'gray';
  };

  return (
    <VStack align="stretch" spacing={3}>
      {history.map((entry) => (
        <Box
          key={entry.id}
          p={{ base: 3, md: 4 }}
          bg="gray.800"
          borderRadius="md"
          borderWidth={1}
          borderColor="gray.700"
        >
          <HStack justify="space-between" flexWrap={{ base: 'wrap', sm: 'nowrap' }}>
            <HStack spacing={{ base: 2, md: 3 }} flex={1}>
              {getChangeIcon(entry.changeAmount)}
              <Box>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.400">
                  {new Date(entry.createdAt).toLocaleString()}
                </Text>
                <HStack spacing={2} mt={1}>
                  <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="semibold">
                    {entry.previousScore}
                  </Text>
                  <Text color="gray.500">→</Text>
                  <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="semibold">
                    {entry.newScore}
                  </Text>
                </HStack>
              </Box>
            </HStack>
            <VStack align="end" spacing={1}>
              <Badge
                colorScheme={getChangeColor(entry.changeAmount)}
                fontSize={{ base: 'sm', md: 'md' }}
                px={2}
                py={1}
              >
                {entry.changeAmount > 0 ? '+' : ''}
                {entry.changeAmount}
              </Badge>
              <Text fontSize="xs" color="gray.500" textTransform="capitalize">
                {entry.changeType}
              </Text>
            </VStack>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
}
