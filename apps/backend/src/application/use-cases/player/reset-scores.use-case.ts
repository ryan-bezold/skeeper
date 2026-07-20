import { Inject, Injectable } from '@nestjs/common';
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

@Injectable()
export class ResetScoresUseCase {
  constructor(
    @Inject(PLAYER_REPOSITORY)
    private readonly playerRepository: IPlayerRepository,
    @Inject(SCORE_HISTORY_REPOSITORY)
    private readonly scoreHistoryRepository: IScoreHistoryRepository,
  ) {}

  async execute(roomId: string): Promise<Player[]> {
    const players = await this.playerRepository.findByRoomId(roomId);

    const updatedPlayers = await Promise.all(
      players.map(async (player) => {
        const previousScore = player.score;
        player.setScore(0);

        const scoreHistory = ScoreHistory.create(
          uuidv4(),
          player.id,
          previousScore,
          0,
          'set',
        );
        await this.scoreHistoryRepository.create(scoreHistory);

        return await this.playerRepository.update(player);
      }),
    );

    return updatedPlayers;
  }
}
