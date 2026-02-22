import {Inject, Injectable, Logger} from '@nestjs/common';
import { Room } from '@domain/entities/room.entity';
import {
    IRoomRepository,
    ROOM_REPOSITORY,
} from '@domain/repositories/room.repository.interface';

@Injectable()
export class GetAllRoomsUseCase {
    constructor(
        @Inject(ROOM_REPOSITORY)
        private readonly roomRepository: IRoomRepository,
    ) {}

    private readonly logger = new Logger(GetAllRoomsUseCase.name);

    async execute(): Promise<Room[]> {
        this.logger.debug("GetAllRoomsUseCase execution started")

        let result: Room[] = await this.roomRepository.findAll();
        this.logger.debug(`Found ${result.length} rooms`)

        this.logger.debug("GetAllRoomsUseCase execution ended")
        return result;
    }
}
