import {Inject, Injectable, Logger, NotFoundException} from '@nestjs/common';
import {
    IRoomRepository,
    ROOM_REPOSITORY,
} from '@domain/repositories/room.repository.interface';

export interface DeleteRoomDto {
    roomId: string;
}

@Injectable()
export class DeleteRoomUseCase {
    constructor(
        @Inject(ROOM_REPOSITORY)
        private readonly roomRepository: IRoomRepository,
    ) {}

    private readonly logger = new Logger(DeleteRoomUseCase.name);

    async execute(dto: DeleteRoomDto): Promise<void> {
        this.logger.debug("Execution started");

        const room = await this.roomRepository.findById(dto.roomId);
        if (!room) {
            throw new NotFoundException(`Room with id ${dto.roomId} not found`);
        } else {
            await this.roomRepository.delete(dto.roomId);
        }

        this.logger.debug("Execution ended");
    }
}
