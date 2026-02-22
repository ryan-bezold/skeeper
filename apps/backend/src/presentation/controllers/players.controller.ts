import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreatePlayerUseCase } from '@application/use-cases/player/create-player.use-case';
import { UpdateScoreUseCase } from '@application/use-cases/player/update-score.use-case';
import {
  CreatePlayerDto,
  UpdatePlayerDto,
  UpdateScoreDto,
} from '@presentation/dtos/player.dto';

@Controller('rooms/:roomId/players')
export class PlayersController {
  constructor(
    private readonly createPlayerUseCase: CreatePlayerUseCase,
    private readonly updateScoreUseCase: UpdateScoreUseCase,
  ) {}

  @Post()
  async create(
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Body() dto: CreatePlayerDto,
  ) {
    return await this.createPlayerUseCase.execute({
      name: dto.name,
      roomId,
    });
  }

  @Get()
  async findAll(@Param('roomId', ParseUUIDPipe) roomId: string) {
    // TODO: Implement list players use case
    return [];
  }

  @Patch(':id/score')
  async updateScore(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateScoreDto,
  ) {
    return await this.updateScoreUseCase.execute({
      playerId: id,
      operation: dto.operation,
      value: dto.value,
    });
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePlayerDto,
  ) {
    // TODO: Implement update player use case
    return { id, ...dto };
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    // TODO: Implement delete player use case
    return { id };
  }
}
