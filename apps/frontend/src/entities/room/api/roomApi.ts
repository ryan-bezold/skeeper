import { apiClient } from '@shared/api/client';
import { Room, CreateRoomDto } from '../model/types';

export const roomApi = {
  create: (data: CreateRoomDto): Promise<Room> => {
    return apiClient.post<Room>('/rooms', data);
  },

  getAll: (): Promise<Room[]> => {
    return apiClient.get<Room[]>('/rooms');
  },

  getById: (id: string): Promise<Room> => {
    return apiClient.get<Room>(`/rooms/${id}`);
  },

  update: (id: string, data: { name: string }): Promise<Room> => {
    return apiClient.patch<Room>(`/rooms/${id}`, data);
  },

  delete: (id: string): Promise<void> => {
    return apiClient.delete(`/rooms/${id}`);
  },
};
