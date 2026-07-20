import { ScoreHistory } from '../entities/score-history.entity';

export interface IScoreHistoryRepository {
  create(scoreHistory: ScoreHistory): Promise<ScoreHistory>;
  update(scoreHistory: ScoreHistory): Promise<ScoreHistory>;
  findByPlayerId(playerId: string): Promise<ScoreHistory[]>;
  findLatestByPlayerId(playerId: string): Promise<ScoreHistory | null>;
  findByRoomId(roomId: string): Promise<ScoreHistory[]>;
}

export const SCORE_HISTORY_REPOSITORY = Symbol('SCORE_HISTORY_REPOSITORY');
