export interface Player {
  id: string;
  name: string;
  score: number;
  roomId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlayerDto {
  name: string;
}

export interface UpdateScoreDto {
  operation: 'increment' | 'decrement' | 'set';
  value: number;
}
