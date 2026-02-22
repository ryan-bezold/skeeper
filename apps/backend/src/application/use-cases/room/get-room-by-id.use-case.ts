import {Inject, Injectable, Logger, NotFoundException} from '@nestjs/common';
import { Room } from '@domain/entities/room.entity';
import {
    IRoomRepository,
    ROOM_REPOSITORY,
} from '@domain/repositories/room.repository.interface';

interface GetByRoomId {
    roomId: string;
}

@Injectable()
export class GetRoomByIdUseCase {
    constructor(
        @Inject(ROOM_REPOSITORY)
        private readonly roomRepository: IRoomRepository,
    ) {}

    private readonly logger = new Logger(GetRoomByIdUseCase.name);

    async execute(dto: GetByRoomId): Promise<Room | null> {
        this.logger.debug("GetRoomByIdUseCase execution started");

        let result: Room | null = await this.roomRepository.findById(dto.roomId);

        if (!result) {
            throw new NotFoundException(`Room with id ${dto.roomId} not found`);
        }

        this.logger.debug("GetRoomByIdUseCase execution ended");
        return result;
    }
}
