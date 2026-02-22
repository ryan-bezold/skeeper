import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Player } from '@domain/entities/player.entity';
import { ScoreHistory } from '@domain/entities/score-history.entity';
import {
  IPlayerRepository,
  PLAYER_REPOSITORY,
} from '@domain/repositories/player.repository.interface';
import {
  IScoreHistoryRepository,
  SCORE_HISTORY_REPOSITORY,
} from '@domain/repositories/score-history.repository.interface';

export type ScoreOperation = 'increment' | 'decrement' | 'set';

export interface UpdateScoreDto {
  playerId: string;
  operation: ScoreOperation;
  value: number;
}

@Injectable()
export class UpdateScoreUseCase {
  constructor(
    @Inject(PLAYER_REPOSITORY)
    private readonly playerRepository: IPlayerRepository,
    @Inject(SCORE_HISTORY_REPOSITORY)
    private readonly scoreHistoryRepository: IScoreHistoryRepository,
  ) {}

  async execute(dto: UpdateScoreDto): Promise<Player> {
    const player = await this.playerRepository.findById(dto.playerId);

    if (!player) {
      throw new NotFoundException(`Player with id ${dto.playerId} not found`);
    }

    const previousScore = player.score;

    switch (dto.operation) {
      case 'increment':
        player.incrementScore(dto.value);
        break;
      case 'decrement':
        player.decrementScore(dto.value);
        break;
      case 'set':
        player.setScore(dto.value);
        break;
    }

    // Record score history
    const scoreHistory = ScoreHistory.create(
      uuidv4(),
      player.id,
      previousScore,
      player.score,
      dto.operation,
    );
    await this.scoreHistoryRepository.create(scoreHistory);

    return await this.playerRepository.update(player);
  }
}
