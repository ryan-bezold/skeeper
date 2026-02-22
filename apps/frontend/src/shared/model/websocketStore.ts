import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { usePlayerStore } from '@entities/player/model/playerStore';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';

interface ScoreChangedEvent {
  playerId: string;
  newScore: number;
}

export interface LastScoreEvent {
  playerId: string;
  newScore: number;
  timestamp: number;
}

// Keep mutable references outside store state to avoid serialization issues
let _socket: Socket | null = null;
const _suppressedPlayerIds = new Set<string>();
const _suppressTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

interface WebSocketState {
  isConnected: boolean;
  reconnectAttempts: number;
  subscribedPlayerIds: string[];
  lastScoreEvent: LastScoreEvent | null;

  connect: () => Socket;
  disconnect: () => void;
  subscribeToPlayer: (playerId: string) => void;
  unsubscribeFromPlayer: (playerId: string) => void;
  suppressNextScoreEvent: (playerId: string) => void;
}

export const useWebSocketStore = create<WebSocketState>()((set, get) => ({
  isConnected: false,
  reconnectAttempts: 0,
  subscribedPlayerIds: [],
  lastScoreEvent: null,

  connect: () => {
    if (_socket) return _socket;

    _socket = io(WS_URL, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30000,
      randomizationFactor: 0.5,
    });

    _socket.on('connect', () => set({ isConnected: true, reconnectAttempts: 0 }));
    _socket.on('disconnect', () => set({ isConnected: false }));
    _socket.on('reconnect_attempt', (attempt: number) => set({ reconnectAttempts: attempt }));
    _socket.on('reconnect', () => set({ isConnected: true, reconnectAttempts: 0 }));
    _socket.on('score_changed', (event: ScoreChangedEvent) => {
      usePlayerStore.getState().setPlayerScore(event.playerId, event.newScore);
      if (_suppressedPlayerIds.has(event.playerId)) {
        _suppressedPlayerIds.delete(event.playerId);
        clearTimeout(_suppressTimeouts.get(event.playerId));
        _suppressTimeouts.delete(event.playerId);
        return;
      }
      set({ lastScoreEvent: { playerId: event.playerId, newScore: event.newScore, timestamp: Date.now() } });
    });

    set({ isConnected: _socket.connected });
    return _socket;
  },

  disconnect: () => {
    if (_socket) {
      _socket.disconnect();
      _socket = null;
    }
    set({ isConnected: false, reconnectAttempts: 0, subscribedPlayerIds: [] });
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

  suppressNextScoreEvent: (playerId: string) => {
    // Clear any existing timeout for this player before setting a new one
    clearTimeout(_suppressTimeouts.get(playerId));
    _suppressedPlayerIds.add(playerId);
    // Safety: auto-expire after 5s in case the API call fails and no WS event arrives
    _suppressTimeouts.set(
      playerId,
      setTimeout(() => {
        _suppressedPlayerIds.delete(playerId);
        _suppressTimeouts.delete(playerId);
      }, 5000),
    );
  },
}));
