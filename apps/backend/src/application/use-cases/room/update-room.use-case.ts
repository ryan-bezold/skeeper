import {Inject, Injectable, Logger, NotFoundException} from '@nestjs/common';
import { Room } from '@domain/entities/room.entity';
import {
    IRoomRepository,
    ROOM_REPOSITORY,
} from '@domain/repositories/room.repository.interface';

interface UpdateRoomDto {
    id: string;
    name: string;
}

@Injectable()
export class UpdateRoomUseCase {
    constructor(
        @Inject(ROOM_REPOSITORY)
        private readonly roomRepository: IRoomRepository,
    ) {}

    private readonly logger = new Logger(UpdateRoomUseCase.name);

    async execute(dto: UpdateRoomDto): Promise<Room | null> {
        this.logger.debug('UpdateRoomUseCase execution started');
        let result: Room | null = null;

        const room = await this.roomRepository.findById(dto.id);

        if (!room) {
            throw new NotFoundException(`Room with id ${dto.id} not found`);
        } else {
            this.logger.debug('Found room', room);
            room.rename(dto.name)
            result = await this.roomRepository.update(room);
        }

        this.logger.debug('UpdateRoomUseCase finished execution')
        return result;
    }
}
