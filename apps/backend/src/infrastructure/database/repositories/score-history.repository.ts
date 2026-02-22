import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScoreHistory } from '@domain/entities/score-history.entity';
import { IScoreHistoryRepository } from '@domain/repositories/score-history.repository.interface';
import { ScoreHistoryTypeOrmEntity } from '../entities/score-history.typeorm-entity';

@Injectable()
export class ScoreHistoryRepository implements IScoreHistoryRepository {
  constructor(
    @InjectRepository(ScoreHistoryTypeOrmEntity)
    private readonly repository: Repository<ScoreHistoryTypeOrmEntity>,
  ) {}

  async create(scoreHistory: ScoreHistory): Promise<ScoreHistory> {
    const entity = this.repository.create(this.toTypeOrm(scoreHistory));
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async findByPlayerId(playerId: string): Promise<ScoreHistory[]> {
    const entities = await this.repository.find({
      where: { playerId },
      order: { createdAt: 'DESC' },
    });
    return entities.map((e) => this.toDomain(e));
  }

  async findByRoomId(roomId: string): Promise<ScoreHistory[]> {
    const entities = await this.repository
      .createQueryBuilder('history')
      .innerJoin('history.player', 'player')
      .where('player.roomId = :roomId', { roomId })
      .orderBy('history.createdAt', 'DESC')
      .getMany();
    return entities.map((e) => this.toDomain(e));
  }

  private toDomain(entity: ScoreHistoryTypeOrmEntity): ScoreHistory {
    return new ScoreHistory(
      entity.id,
      entity.playerId,
      entity.previousScore,
      entity.newScore,
      entity.changeAmount,
      entity.changeType,
      entity.createdAt,
    );
  }

  private toTypeOrm(scoreHistory: ScoreHistory): ScoreHistoryTypeOrmEntity {
    const entity = new ScoreHistoryTypeOrmEntity();
    entity.id = scoreHistory.id;
    entity.playerId = scoreHistory.playerId;
    entity.previousScore = scoreHistory.previousScore;
    entity.newScore = scoreHistory.newScore;
    entity.changeAmount = scoreHistory.changeAmount;
    entity.changeType = scoreHistory.changeType;
    entity.createdAt = scoreHistory.createdAt;
    return entity;
  }
}
