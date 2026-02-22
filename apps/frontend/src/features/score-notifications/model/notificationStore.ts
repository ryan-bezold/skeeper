import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NotificationState {
  mutedPlayerIds: string[];
  mutePlayer: (playerId: string) => void;
  unmutePlayer: (playerId: string) => void;
  isMuted: (playerId: string) => boolean;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      mutedPlayerIds: [],

      mutePlayer: (playerId) =>
        set((s) => ({
          mutedPlayerIds: s.mutedPlayerIds.includes(playerId)
            ? s.mutedPlayerIds
            : [...s.mutedPlayerIds, playerId],
        })),

      unmutePlayer: (playerId) =>
        set((s) => ({
          mutedPlayerIds: s.mutedPlayerIds.filter((id) => id !== playerId),
        })),

      isMuted: (playerId) => get().mutedPlayerIds.includes(playerId),
    }),
    { name: 'score-notification-preferences' },
  ),
);
