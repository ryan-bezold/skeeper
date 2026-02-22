import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '@domain/entities/player.entity';
import { IPlayerRepository } from '@domain/repositories/player.repository.interface';
import { PlayerTypeOrmEntity } from '../entities/player.typeorm-entity';

@Injectable()
export class PlayerRepository implements IPlayerRepository {
  constructor(
    @InjectRepository(PlayerTypeOrmEntity)
    private readonly repository: Repository<PlayerTypeOrmEntity>,
  ) {}

  async create(player: Player): Promise<Player> {
    const entity = this.repository.create(this.toTypeOrm(player));
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Player | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByRoomId(roomId: string): Promise<Player[]> {
    const entities = await this.repository.find({ where: { roomId } });
    return entities.map((e) => this.toDomain(e));
  }

  async update(player: Player): Promise<Player> {
    await this.repository.save(this.toTypeOrm(player));
    return player;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(entity: PlayerTypeOrmEntity): Player {
    return new Player(
      entity.id,
      entity.name,
      entity.score,
      entity.roomId,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  private toTypeOrm(player: Player): PlayerTypeOrmEntity {
    const entity = new PlayerTypeOrmEntity();
    entity.id = player.id;
    entity.name = player.name;
    entity.score = player.score;
    entity.roomId = player.roomId;
    entity.createdAt = player.createdAt;
    entity.updatedAt = player.updatedAt;
    return entity;
  }
}
