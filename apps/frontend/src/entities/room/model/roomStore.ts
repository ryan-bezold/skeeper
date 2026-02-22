import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { roomApi } from '../api/roomApi';
import { Room, CreateRoomDto } from './types';

interface RoomState {
  rooms: Room[];
  currentRoom: Room | null;
  isLoadingRooms: boolean;
  isLoadingRoom: boolean;
  isCreating: boolean;
  error: string | null;

  fetchRooms: () => Promise<void>;
  fetchRoom: (id: string) => Promise<Room>;
  createRoom: (data?: CreateRoomDto) => Promise<Room>;
  updateRoom: (id: string, name: string) => Promise<void>;
  deleteRoom: (id: string) => Promise<void>;
  joinByShareCode: (shareCode: string) => Promise<Room>;
  setCurrentRoom: (room: Room | null) => void;
  clearError: () => void;
}

export const useRoomStore = create<RoomState>()(
  persist(
    (set, get) => ({
      rooms: [],
      currentRoom: null,
      isLoadingRooms: false,
      isLoadingRoom: false,
      isCreating: false,
      error: null,

      fetchRooms: async () => {
        set({ isLoadingRooms: true, error: null });
        try {
          const rooms = await roomApi.getAll();
          set({ rooms, isLoadingRooms: false });
        } catch {
          set({ error: 'Failed to load rooms', isLoadingRooms: false });
          throw new Error('Failed to load rooms');
        }
      },

      fetchRoom: async (id: string) => {
        set({ isLoadingRoom: true, error: null });
        try {
          const room = await roomApi.getById(id);
          set({ currentRoom: room, isLoadingRoom: false });
          return room;
        } catch {
          set({ error: 'Failed to load room', isLoadingRoom: false });
          throw new Error('Failed to load room');
        }
      },

      createRoom: async (data = { name: 'New Game Room' }) => {
        set({ isCreating: true, error: null });
        try {
          const room = await roomApi.create(data);
          set((state) => ({ rooms: [...state.rooms, room], isCreating: false }));
          return room;
        } catch {
          set({ error: 'Failed to create room', isCreating: false });
          throw new Error('Failed to create room');
        }
      },

      updateRoom: async (id: string, name: string) => {
        const prevRooms = get().rooms;
        const prevCurrentRoom = get().currentRoom;
        // Optimistic update
        set((state) => ({
          rooms: state.rooms.map((r) => (r.id === id ? { ...r, name } : r)),
          currentRoom:
            state.currentRoom?.id === id ? { ...state.currentRoom, name } : state.currentRoom,
        }));
        try {
          await roomApi.update(id, { name });
        } catch {
          set({ rooms: prevRooms, currentRoom: prevCurrentRoom });
          throw new Error('Failed to update room');
        }
      },

      deleteRoom: async (id: string) => {
        const prevRooms = get().rooms;
        // Optimistic update
        set((state) => ({ rooms: state.rooms.filter((r) => r.id !== id) }));
        try {
          await roomApi.delete(id);
        } catch {
          set({ rooms: prevRooms });
          throw new Error('Failed to delete room');
        }
      },

      joinByShareCode: async (shareCode: string) => {
        try {
          return await roomApi.getByShareCode(shareCode);
        } catch {
          throw new Error('Room not found');
        }
      },

      setCurrentRoom: (room: Room | null) => set({ currentRoom: room }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'skeeper-rooms',
      // Only persist the rooms list for immediate display on load
      partialize: (state) => ({ rooms: state.rooms }),
    },
  ),
);
