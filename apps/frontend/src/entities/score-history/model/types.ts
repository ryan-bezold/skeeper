export interface ScoreHistory {
  id: string;
  playerId: string;
  previousScore: number;
  newScore: number;
  changeAmount: number;
  changeType: 'increment' | 'decrement' | 'set';
  createdAt: string;
}
