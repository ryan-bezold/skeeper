import { SimpleGrid, SimpleGridProps } from '@chakra-ui/react';

/**
 * Responsive grid component for player cards
 * - Mobile: 1 column
 * - Tablet: 2 columns
 * - Desktop: 3+ columns
 */
export function ResponsiveGrid(props: SimpleGridProps) {
  return (
    <SimpleGrid
      columns={{ base: 1, sm: 2, md: 2, lg: 3, xl: 4 }}
      spacing={{ base: 4, md: 6 }}
      {...props}
    />
  );
}
