import { Inject, Injectable } from '@nestjs/common';
import { ScoreHistory } from '@domain/entities/score-history.entity';
import {
  IScoreHistoryRepository,
  SCORE_HISTORY_REPOSITORY,
} from '@domain/repositories/score-history.repository.interface';

@Injectable()
export class GetPlayerScoreHistoryUseCase {
  constructor(
    @Inject(SCORE_HISTORY_REPOSITORY)
    private readonly scoreHistoryRepository: IScoreHistoryRepository,
  ) {}

  async execute(playerId: string): Promise<ScoreHistory[]> {
    return await this.scoreHistoryRepository.findByPlayerId(playerId);
  }
}
