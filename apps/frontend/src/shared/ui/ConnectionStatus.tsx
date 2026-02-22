import { Badge, Box, Tooltip } from '@chakra-ui/react';
import { useWebSocketStore } from '@shared/model/websocketStore';

export function ConnectionStatus() {
    const isConnected = useWebSocketStore((s) => s.isConnected);
    const reconnectAttempts = useWebSocketStore((s) => s.reconnectAttempts);

    const isReconnecting = !isConnected && reconnectAttempts > 0;

    const colorScheme = isConnected ? 'green' : isReconnecting ? 'yellow' : 'red';
    const label = isConnected
        ? 'Connected'
        : isReconnecting
        ? `Reconnecting… (attempt ${reconnectAttempts})`
        : 'Disconnected';

    return (
        <Tooltip label={label} placement="left" hasArrow>
            <Box position="fixed" bottom={4} right={4} zIndex="tooltip">
                <Badge
                    colorScheme={colorScheme}
                    variant="solid"
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontSize="xs"
                    cursor="default"
                >
                    {isConnected ? 'Live' : isReconnecting ? 'Reconnecting' : 'Offline'}
                </Badge>
            </Box>
        </Tooltip>
    );
}
