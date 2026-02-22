import { ScoreHistory } from '../entities/score-history.entity';

export interface IScoreHistoryRepository {
  create(scoreHistory: ScoreHistory): Promise<ScoreHistory>;
  findByPlayerId(playerId: string): Promise<ScoreHistory[]>;
  findByRoomId(roomId: string): Promise<ScoreHistory[]>;
}

export const SCORE_HISTORY_REPOSITORY = Symbol('SCORE_HISTORY_REPOSITORY');
