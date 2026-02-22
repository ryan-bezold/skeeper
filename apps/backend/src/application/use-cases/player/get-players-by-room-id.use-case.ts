import {Inject, Injectable, Logger, NotFoundException} from '@nestjs/common';
import { Player } from '@domain/entities/player.entity';
import {
    IPlayerRepository,
    PLAYER_REPOSITORY,
} from '@domain/repositories/player.repository.interface';
import {IRoomRepository, ROOM_REPOSITORY} from "@domain/repositories/room.repository.interface";

interface GetPlayersByRoomIdDto {
    roomId: string;
}

@Injectable()
export class GetPlayersByRoomIdUseCase {
    constructor(
        @Inject(PLAYER_REPOSITORY)
        private readonly playerRepository: IPlayerRepository,
        @Inject(ROOM_REPOSITORY)
        private readonly roomRepository: IRoomRepository,
    ) {}

    private readonly logger = new Logger(GetPlayersByRoomIdUseCase.name);

    async execute(dto: GetPlayersByRoomIdDto): Promise<Player[]> {
        this.logger.debug('Execution Started');

        const room = await this.roomRepository.findById(dto.roomId);

        if (!room) {
            throw new NotFoundException(`Room with id ${dto.roomId} not found`);
        }

        const result = await this.playerRepository.findByRoomId(dto.roomId);

        this.logger.debug('Execution Ended');
        return result;
    }
}
