import { Inject, Injectable } from '@nestjs/common';
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

  async execute(dto: CreateRoomDto): Promise<Room> {
    const shareCode = this.generateShareCode();
    const room = new Room(
      uuidv4(),
      dto.name,
      shareCode,
      new Date(),
      new Date(),
    );

    return await this.roomRepository.create(room);
  }

  private generateShareCode(): string {
    return uuidv4().slice(0, 8);
  }
}
