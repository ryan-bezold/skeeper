import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Room } from '@domain/entities/room.entity';
import {
    IRoomRepository,
    ROOM_REPOSITORY,
} from '@domain/repositories/room.repository.interface';

interface GetRoomByShareCode {
    shareCode: string;
}

@Injectable()
export class GetRoomByShareCodeUseCase {
    constructor(
        @Inject(ROOM_REPOSITORY)
        private readonly roomRepository: IRoomRepository,
    ) {}

    private readonly logger = new Logger(GetRoomByShareCodeUseCase.name);

    async execute(dto: GetRoomByShareCode): Promise<Room> {
        this.logger.debug('GetRoomByShareCodeUseCase execution started');

        const result: Room | null = await this.roomRepository.findByShareCode(dto.shareCode);

        if (!result) {
            throw new NotFoundException(`Room with share code ${dto.shareCode} not found`);
        }

        this.logger.debug('GetRoomByShareCodeUseCase execution ended');
        return result;
    }
}
