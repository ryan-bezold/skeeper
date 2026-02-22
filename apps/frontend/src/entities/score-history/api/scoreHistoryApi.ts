import { apiClient } from '@shared/api/client';
import { ScoreHistory } from '../model/types';

export const scoreHistoryApi = {
  getByPlayerId: (playerId: string): Promise<ScoreHistory[]> => {
    return apiClient.get<ScoreHistory[]>(`/players/${playerId}/score-history`);
  },

  getByRoomId: (roomId: string): Promise<ScoreHistory[]> => {
    return apiClient.get<ScoreHistory[]>(`/rooms/${roomId}/score-history`);
  },
};
