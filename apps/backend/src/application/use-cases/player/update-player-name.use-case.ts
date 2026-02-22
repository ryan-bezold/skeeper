import {Inject, Injectable, Logger, NotFoundException} from '@nestjs/common';
import { Player } from '@domain/entities/player.entity';
import {
    IPlayerRepository,
    PLAYER_REPOSITORY,
} from '@domain/repositories/player.repository.interface';

interface UpdatePlayerNameDto {
    playerId: string;
    name: string;
}

@Injectable()
export class UpdatePlayerNameUseCase {
    constructor(
        @Inject(PLAYER_REPOSITORY)
        private readonly playerRepository: IPlayerRepository,
    ) {}

    private readonly logger = new Logger(UpdatePlayerNameUseCase.name);

    async execute(dto: UpdatePlayerNameDto): Promise<Player> {
        this.logger.debug('Execution Started');

        const player = await this.playerRepository.findById(dto.playerId);

        if (!player) {
            throw new NotFoundException(`Player with id ${dto.playerId} not found`);
        }

        player.rename(dto.name);
        const result = await this.playerRepository.update(player);

        this.logger.debug('Execution Ended');
        return result;
    }
}
