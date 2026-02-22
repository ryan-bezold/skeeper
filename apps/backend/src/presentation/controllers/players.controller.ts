import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Param,
} from '@nestjs/common';
import { CreatePlayerUseCase } from '@application/use-cases/player/create-player.use-case';
import { UpdateScoreUseCase } from '@application/use-cases/player/update-score.use-case';

@Controller('rooms/:roomId/players')
export class PlayersController {
  constructor(
    private readonly createPlayerUseCase: CreatePlayerUseCase,
    private readonly updateScoreUseCase: UpdateScoreUseCase,
  ) {}

  @Post()
  async create(
    @Param('roomId') roomId: string,
    @Body() body: { name: string },
  ) {
    return await this.createPlayerUseCase.execute({
      name: body.name,
      roomId,
    });
  }

  @Get()
  async findAll(@Param('roomId') roomId: string) {
    // TODO: Implement list players use case
    return [];
  }

  @Patch(':id/score')
  async updateScore(
    @Param('id') id: string,
    @Body() body: { operation: 'increment' | 'decrement' | 'set'; value: number },
  ) {
    return await this.updateScoreUseCase.execute({
      playerId: id,
      operation: body.operation,
      value: body.value,
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: { name: string }) {
    // TODO: Implement update player use case
    return { id, ...body };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    // TODO: Implement delete player use case
    return { id };
  }
}
