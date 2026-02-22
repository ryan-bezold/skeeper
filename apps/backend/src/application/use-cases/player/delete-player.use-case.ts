import {Inject, Injectable, Logger, NotFoundException} from '@nestjs/common';
import {
    IPlayerRepository,
    PLAYER_REPOSITORY,
} from '@domain/repositories/player.repository.interface';

interface DeletePlayerDto {
    playerId: string;
}

@Injectable()
export class DeletePlayerUseCase {
    constructor(
        @Inject(PLAYER_REPOSITORY)
        private readonly playerRepository: IPlayerRepository,
    ) {}

    private readonly logger = new Logger(DeletePlayerUseCase.name);

    async execute(dto: DeletePlayerDto): Promise<void> {
        this.logger.debug('Execution Started');

        const player = await this.playerRepository.findById(dto.playerId);

        if (!player) {
            throw new NotFoundException(`Player with id ${dto.playerId} not found`);
        }

        const result = await this.playerRepository.delete(dto.playerId);

        this.logger.debug('Execution Ended');
        return result;
    }
}
