import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsController } from '@presentation/controllers/rooms.controller';
import { PlayersController } from '@presentation/controllers/players.controller';
import { ScoreHistoryController } from '@presentation/controllers/score-history.controller';
import { ScoreGateway } from '@presentation/gateways/score.gateway';
import { CreateRoomUseCase } from '@application/use-cases/room/create-room.use-case';
import { CreatePlayerUseCase } from '@application/use-cases/player/create-player.use-case';
import { UpdateScoreUseCase } from '@application/use-cases/player/update-score.use-case';
import { GetPlayerScoreHistoryUseCase } from '@application/use-cases/score-history/get-player-score-history.use-case';
import { GetRoomScoreHistoryUseCase } from '@application/use-cases/score-history/get-room-score-history.use-case';
import { PlayerRepository } from '@infrastructure/database/repositories/player.repository';
import { RoomRepository } from '@infrastructure/database/repositories/room.repository';
import { ScoreHistoryRepository } from '@infrastructure/database/repositories/score-history.repository';
import { PlayerTypeOrmEntity } from '@infrastructure/database/entities/player.typeorm-entity';
import { RoomTypeOrmEntity } from '@infrastructure/database/entities/room.typeorm-entity';
import { ScoreHistoryTypeOrmEntity } from '@infrastructure/database/entities/score-history.typeorm-entity';
import {
  PLAYER_REPOSITORY,
} from '@domain/repositories/player.repository.interface';
import {
  ROOM_REPOSITORY,
} from '@domain/repositories/room.repository.interface';
import {
  SCORE_HISTORY_REPOSITORY,
} from '@domain/repositories/score-history.repository.interface';
import {DeleteRoomUseCase} from "@application/use-cases/room/delete-room.use-case";
import {GetAllRoomsUseCase} from "@application/use-cases/room/get-all-rooms.use-case";
import {GetRoomByIdUseCase} from "@application/use-cases/room/get-room-by-id.use-case";
import {UpdateRoomUseCase} from "@application/use-cases/room/update-room.use-case";
import {GetPlayersByRoomIdUseCase} from "@application/use-cases/player/get-players-by-room-id.use-case";
import {UpdatePlayerNameUseCase} from "@application/use-cases/player/update-player-name.use-case";
import {DeletePlayerUseCase} from "@application/use-cases/player/delete-player.use-case";
import { SCORE_EVENT_PUBLISHER } from '@application/ports/score-event-publisher.interface';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DATABASE_HOST'),
        port: config.get('DATABASE_PORT'),
        username: config.get('DATABASE_USER'),
        password: config.get('DATABASE_PASSWORD'),
        database: config.get('DATABASE_NAME'),
        entities: [
          PlayerTypeOrmEntity,
          RoomTypeOrmEntity,
          ScoreHistoryTypeOrmEntity,
        ],
        synchronize: config.get('NODE_ENV') === 'development',
      }),
    }),
    TypeOrmModule.forFeature([
      PlayerTypeOrmEntity,
      RoomTypeOrmEntity,
      ScoreHistoryTypeOrmEntity,
    ]),
  ],
  controllers: [RoomsController, PlayersController, ScoreHistoryController],
  providers: [
    ScoreGateway,
    CreateRoomUseCase,
    DeleteRoomUseCase,
    GetAllRoomsUseCase,
    GetRoomByIdUseCase,
    UpdateRoomUseCase,
    CreatePlayerUseCase,
    UpdateScoreUseCase,
    GetPlayersByRoomIdUseCase,
    UpdatePlayerNameUseCase,
    DeletePlayerUseCase,
    GetPlayerScoreHistoryUseCase,
    GetRoomScoreHistoryUseCase,
    {
      provide: PLAYER_REPOSITORY,
      useClass: PlayerRepository,
    },
    {
      provide: ROOM_REPOSITORY,
      useClass: RoomRepository,
    },
    {
      provide: SCORE_HISTORY_REPOSITORY,
      useClass: ScoreHistoryRepository,
    },
    {
      provide: SCORE_EVENT_PUBLISHER,
      useExisting: ScoreGateway,
    },
  ],
})
export class AppModule {}
