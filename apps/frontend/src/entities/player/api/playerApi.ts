import { apiClient } from '@shared/api/client';
import { Player, CreatePlayerDto, UpdateScoreDto } from '../model/types';

export const playerApi = {
  create: (roomId: string, data: CreatePlayerDto): Promise<Player> => {
    return apiClient.post<Player>(`/rooms/${roomId}/players`, data);
  },

  getByRoomId: (roomId: string): Promise<Player[]> => {
    return apiClient.get<Player[]>(`/rooms/${roomId}/players`);
  },

  updateScore: (playerId: string, data: UpdateScoreDto): Promise<Player> => {
    return apiClient.patch<Player>(`/rooms/_/players/${playerId}/score`, data);
  },

  update: (playerId: string, data: { name: string }): Promise<Player> => {
    return apiClient.patch<Player>(`/rooms/_/players/${playerId}`, data);
  },

  delete: (playerId: string): Promise<void> => {
    return apiClient.delete(`/rooms/_/players/${playerId}`);
  },

  resetScores: (roomId: string): Promise<Player[]> => {
    return apiClient.post<Player[]>(`/rooms/${roomId}/players/reset-scores`);
  },
};
