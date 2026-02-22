import { io, Socket } from 'socket.io-client';
import { env } from '@shared/config/env';

const WS_URL = env.wsUrl;

class WebSocketClient {
  private socket: Socket | null = null;

  connect(): Socket {
    if (!this.socket) {
      this.socket = io(WS_URL);
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const wsClient = new WebSocketClient();
