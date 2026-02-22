import {
    Controller,
    Post,
    Get,
    Delete,
    Patch,
    Body,
    Param,
    ParseUUIDPipe, HttpCode,
} from '@nestjs/common';
import { CreatePlayerUseCase } from '@application/use-cases/player/create-player.use-case';
import { UpdateScoreUseCase } from '@application/use-cases/player/update-score.use-case';
import {
  CreatePlayerDto,
  UpdatePlayerDto,
  UpdateScoreDto,
} from '@presentation/dtos/player.dto';
import {GetPlayersByRoomIdUseCase} from "@application/use-cases/player/get-players-by-room-id.use-case";
import {UpdatePlayerNameUseCase} from "@application/use-cases/player/update-player-name.use-case";
import {DeletePlayerUseCase} from "@application/use-cases/player/delete-player.use-case";

@Controller('rooms/:roomId/players')
export class PlayersController {
  constructor(
    private readonly createPlayerUseCase: CreatePlayerUseCase,
    private readonly updateScoreUseCase: UpdateScoreUseCase,
    private readonly getPlayersByRoomIdUseCase: GetPlayersByRoomIdUseCase,
    private readonly updatePlayerNameUseCase: UpdatePlayerNameUseCase,
    private readonly deletePlayerUseCase: DeletePlayerUseCase,
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
    return await this.getPlayersByRoomIdUseCase.execute({roomId});
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
    return await this.updatePlayerNameUseCase.execute({playerId: id, ...dto});
  }

  @HttpCode(204)
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.deletePlayerUseCase.execute({playerId: id});
  }
}
