import {
  Box,
  HStack,
  Text,
  Badge,
  VStack,
  Divider,
} from '@chakra-ui/react';
import { Player } from '@entities/player/model/types';

interface PlayerSummaryViewProps {
  players: Player[];
}

export function PlayerSummaryView({ players }: PlayerSummaryViewProps) {
  if (players.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Text color="gray.500" fontSize="sm">
          No players yet
        </Text>
      </Box>
    );
  }

  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <VStack align="stretch" spacing={0}>
      {sorted.map((player, index) => (
        <Box key={player.id}>
          {index > 0 && <Divider borderColor="gray.700" />}
          <HStack
            justify="space-between"
            px={{ base: 3, md: 4 }}
            py={{ base: 2, md: 3 }}
            _hover={{ bg: 'gray.750' }}
          >
            <HStack spacing={3}>
              <Text
                fontSize={{ base: 'xs', md: 'sm' }}
                color="gray.500"
                fontWeight="bold"
                minW="20px"
                textAlign="center"
              >
                {index + 1}
              </Text>
              <Text
                fontSize={{ base: 'sm', md: 'md' }}
                fontWeight="semibold"
                noOfLines={1}
              >
                {player.name}
              </Text>
            </HStack>
            <Badge
              colorScheme="brand"
              fontSize={{ base: 'sm', md: 'md' }}
              px={3}
              py={1}
              borderRadius="md"
            >
              {player.score}
            </Badge>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
}
