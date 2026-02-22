import { Controller, Get, Param } from '@nestjs/common';
import { GetPlayerScoreHistoryUseCase } from '@application/use-cases/score-history/get-player-score-history.use-case';
import { GetRoomScoreHistoryUseCase } from '@application/use-cases/score-history/get-room-score-history.use-case';

@Controller()
export class ScoreHistoryController {
  constructor(
    private readonly getPlayerScoreHistoryUseCase: GetPlayerScoreHistoryUseCase,
    private readonly getRoomScoreHistoryUseCase: GetRoomScoreHistoryUseCase,
  ) {}

  @Get('players/:playerId/score-history')
  async getPlayerHistory(@Param('playerId') playerId: string) {
    return await this.getPlayerScoreHistoryUseCase.execute(playerId);
  }

  @Get('rooms/:roomId/score-history')
  async getRoomHistory(@Param('roomId') roomId: string) {
    return await this.getRoomScoreHistoryUseCase.execute(roomId);
  }
}
