export interface ScoreChangedEvent {
  playerId: string;
  playerName: string;
  roomId: string;
  oldScore: number;
  newScore: number;
  changeAmount: number;
  operation: 'increment' | 'decrement' | 'set';
  timestamp: string;
}

export interface IScoreEventPublisher {
  emitScoreChanged(event: ScoreChangedEvent): void;
}

export const SCORE_EVENT_PUBLISHER = Symbol('SCORE_EVENT_PUBLISHER');
