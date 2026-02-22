import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { usePlayerStore } from '@entities/player/model/playerStore';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';

interface ScoreChangedEvent {
  playerId: string;
  newScore: number;
}

// Keep socket outside store state to avoid serialization issues
let _socket: Socket | null = null;

interface WebSocketState {
  isConnected: boolean;
  subscribedPlayerIds: string[];

  connect: () => Socket;
  disconnect: () => void;
  subscribeToPlayer: (playerId: string) => void;
  unsubscribeFromPlayer: (playerId: string) => void;
}

export const useWebSocketStore = create<WebSocketState>()((set, get) => ({
  isConnected: false,
  subscribedPlayerIds: [],

  connect: () => {
    if (_socket) return _socket;

    _socket = io(WS_URL);

    _socket.on('connect', () => set({ isConnected: true }));
    _socket.on('disconnect', () => set({ isConnected: false }));
    _socket.on('score_changed', (event: ScoreChangedEvent) => {
      usePlayerStore.getState().setPlayerScore(event.playerId, event.newScore);
    });

    set({ isConnected: _socket.connected });
    return _socket;
  },

  disconnect: () => {
    if (_socket) {
      _socket.disconnect();
      _socket = null;
    }
    set({ isConnected: false, subscribedPlayerIds: [] });
  },

  subscribeToPlayer: (playerId: string) => {
    const { subscribedPlayerIds, connect } = get();
    if (subscribedPlayerIds.includes(playerId)) return;

    const socket = connect();
    socket.emit('subscribe_to_player', { playerId });
    set({ subscribedPlayerIds: [...subscribedPlayerIds, playerId] });
  },

  unsubscribeFromPlayer: (playerId: string) => {
    const { subscribedPlayerIds } = get();
    if (!subscribedPlayerIds.includes(playerId)) return;

    if (_socket) {
      _socket.emit('unsubscribe_from_player', { playerId });
    }
    set({ subscribedPlayerIds: subscribedPlayerIds.filter((id) => id !== playerId) });
  },
}));
