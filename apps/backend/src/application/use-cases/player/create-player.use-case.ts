import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Player } from '@domain/entities/player.entity';
import {
  IPlayerRepository,
  PLAYER_REPOSITORY,
} from '@domain/repositories/player.repository.interface';

export interface CreatePlayerDto {
  name: string;
  roomId: string;
}

@Injectable()
export class CreatePlayerUseCase {
  constructor(
    @Inject(PLAYER_REPOSITORY)
    private readonly playerRepository: IPlayerRepository,
  ) {}

  async execute(dto: CreatePlayerDto): Promise<Player> {
    const player = new Player(
      uuidv4(),
      dto.name,
      0,
      dto.roomId,
      new Date(),
      new Date(),
    );

    return await this.playerRepository.create(player);
  }
}
