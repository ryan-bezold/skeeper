import { create } from 'zustand';
import { scoreHistoryApi } from '../api/scoreHistoryApi';
import { ScoreHistory } from './types';

interface ScoreHistoryState {
  // Cache keyed by playerId or roomId
  historyByPlayer: Record<string, ScoreHistory[]>;
  historyByRoom: Record<string, ScoreHistory[]>;
  loadingKeys: string[];
  error: string | null;

  fetchByPlayerId: (playerId: string) => Promise<void>;
  fetchByRoomId: (roomId: string) => Promise<void>;
  invalidatePlayer: (playerId: string) => void;
  invalidateRoom: (roomId: string) => void;
  clearError: () => void;
}

export const useScoreHistoryStore = create<ScoreHistoryState>()((set, get) => ({
  historyByPlayer: {},
  historyByRoom: {},
  loadingKeys: [],
  error: null,

  fetchByPlayerId: async (playerId: string) => {
    const key = `player:${playerId}`;
    if (get().loadingKeys.includes(key)) return;

    set((state) => ({ loadingKeys: [...state.loadingKeys, key], error: null }));
    try {
      const data = await scoreHistoryApi.getByPlayerId(playerId);
      set((state) => ({
        historyByPlayer: { ...state.historyByPlayer, [playerId]: data },
        loadingKeys: state.loadingKeys.filter((k) => k !== key),
      }));
    } catch {
      set((state) => ({
        error: 'Failed to load score history',
        loadingKeys: state.loadingKeys.filter((k) => k !== key),
      }));
    }
  },

  fetchByRoomId: async (roomId: string) => {
    const key = `room:${roomId}`;
    if (get().loadingKeys.includes(key)) return;

    set((state) => ({ loadingKeys: [...state.loadingKeys, key], error: null }));
    try {
      const data = await scoreHistoryApi.getByRoomId(roomId);
      set((state) => ({
        historyByRoom: { ...state.historyByRoom, [roomId]: data },
        loadingKeys: state.loadingKeys.filter((k) => k !== key),
      }));
    } catch {
      set((state) => ({
        error: 'Failed to load score history',
        loadingKeys: state.loadingKeys.filter((k) => k !== key),
      }));
    }
  },

  invalidatePlayer: (playerId: string) => {
    set((state) => {
      const next = { ...state.historyByPlayer };
      delete next[playerId];
      return { historyByPlayer: next };
    });
  },

  invalidateRoom: (roomId: string) => {
    set((state) => {
      const next = { ...state.historyByRoom };
      delete next[roomId];
      return { historyByRoom: next };
    });
  },

  clearError: () => set({ error: null }),
}));
