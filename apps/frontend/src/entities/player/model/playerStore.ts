import { create } from 'zustand';
import { playerApi } from '../api/playerApi';
import { Player } from './types';

interface PlayerState {
  players: Player[];
  isLoading: boolean;
  error: string | null;

  fetchPlayers: (roomId: string) => Promise<void>;
  addPlayer: (roomId: string, name: string) => Promise<Player>;
  deletePlayer: (playerId: string) => Promise<void>;
  renamePlayer: (playerId: string, name: string) => Promise<void>;
  updateScore: (
    playerId: string,
    operation: 'increment' | 'decrement' | 'set',
    value: number,
  ) => Promise<void>;
  setPlayerScore: (playerId: string, score: number) => void;
  clearPlayers: () => void;
  clearError: () => void;
}

export const usePlayerStore = create<PlayerState>()((set, get) => ({
  players: [],
  isLoading: false,
  error: null,

  fetchPlayers: async (roomId: string) => {
    set({ isLoading: true, error: null });
    try {
      const players = await playerApi.getByRoomId(roomId);
      set({ players, isLoading: false });
    } catch {
      set({ error: 'Failed to load players', isLoading: false });
      throw new Error('Failed to load players');
    }
  },

  addPlayer: async (roomId: string, name: string) => {
    try {
      const player = await playerApi.create(roomId, { name });
      set((state) => ({ players: [...state.players, player] }));
      return player;
    } catch {
      throw new Error('Failed to add player');
    }
  },

  deletePlayer: async (playerId: string) => {
    const prevPlayers = get().players;
    // Optimistic update
    set((state) => ({ players: state.players.filter((p) => p.id !== playerId) }));
    try {
      await playerApi.delete(playerId);
    } catch {
      set({ players: prevPlayers });
      throw new Error('Failed to delete player');
    }
  },

  renamePlayer: async (playerId: string, name: string) => {
    const prevPlayers = get().players;
    // Optimistic update
    set((state) => ({
      players: state.players.map((p) => (p.id === playerId ? { ...p, name } : p)),
    }));
    try {
      await playerApi.update(playerId, { name });
    } catch {
      set({ players: prevPlayers });
      throw new Error('Failed to rename player');
    }
  },

  updateScore: async (
    playerId: string,
    operation: 'increment' | 'decrement' | 'set',
    value: number,
  ) => {
    const player = get().players.find((p) => p.id === playerId);
    if (!player) return;

    const prevScore = player.score;
    const newScore =
      operation === 'increment'
        ? prevScore + value
        : operation === 'decrement'
          ? prevScore - value
          : value;

    // Optimistic update
    set((state) => ({
      players: state.players.map((p) => (p.id === playerId ? { ...p, score: newScore } : p)),
    }));
    try {
      await playerApi.updateScore(playerId, { operation, value });
      // WebSocket event will confirm the actual new score
    } catch {
      // Rollback
      set((state) => ({
        players: state.players.map((p) => (p.id === playerId ? { ...p, score: prevScore } : p)),
      }));
      throw new Error('Failed to update score');
    }
  },

  setPlayerScore: (playerId: string, score: number) => {
    set((state) => ({
      players: state.players.map((p) => (p.id === playerId ? { ...p, score } : p)),
    }));
  },

  clearPlayers: () => set({ players: [], error: null }),

  clearError: () => set({ error: null }),
}));
