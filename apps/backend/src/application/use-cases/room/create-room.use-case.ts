import {Inject, Injectable, Logger} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Room } from '@domain/entities/room.entity';
import {
  IRoomRepository,
  ROOM_REPOSITORY,
} from '@domain/repositories/room.repository.interface';

export interface CreateRoomDto {
  name: string;
}

@Injectable()
export class CreateRoomUseCase {
  constructor(
    @Inject(ROOM_REPOSITORY)
    private readonly roomRepository: IRoomRepository,
  ) {}

  private readonly logger = new Logger(CreateRoomUseCase.name);

  async execute(dto: CreateRoomDto): Promise<Room> {
    this.logger.debug("Execution started");

    const shareCode = this.generateShareCode();
    const room = new Room(
      uuidv4(),
      dto.name,
      shareCode,
      new Date(),
      new Date(),
    );

    const result = await this.roomRepository.create(room);

    this.logger.debug("Execution ended");
    return result;
  }

  private generateShareCode(): string {
    this.logger.debug("Generating share code");
    return uuidv4().slice(0, 8);
  }
}
