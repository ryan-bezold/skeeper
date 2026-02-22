import { useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './providers/router';
import { theme } from './providers/theme';
import { useWebSocketStore } from '@shared/model/websocketStore';
import { ScoreNotifications } from '@features/score-notifications';
import { ConnectionStatus } from '@shared/ui/ConnectionStatus';

function WebSocketInit() {
  const connect = useWebSocketStore((s) => s.connect);
  const disconnect = useWebSocketStore((s) => s.disconnect);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return null;
}

export function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <WebSocketInit />
        <ScoreNotifications />
        <AppRouter />
        <ConnectionStatus />
      </BrowserRouter>
    </ChakraProvider>
  );
}
