import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '@domain/entities/room.entity';
import { IRoomRepository } from '@domain/repositories/room.repository.interface';
import { RoomTypeOrmEntity } from '../entities/room.typeorm-entity';

@Injectable()
export class RoomRepository implements IRoomRepository {
  constructor(
    @InjectRepository(RoomTypeOrmEntity)
    private readonly repository: Repository<RoomTypeOrmEntity>,
  ) {}

  async create(room: Room): Promise<Room> {
    const entity = this.repository.create(this.toTypeOrm(room));
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Room | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByShareCode(shareCode: string): Promise<Room | null> {
    const entity = await this.repository.findOne({ where: { shareCode } });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<Room[]> {
    const entities = (await this.repository
      .createQueryBuilder('room')
      .loadRelationCountAndMap('room.playerCount', 'room.players')
      .getMany()) as Array<RoomTypeOrmEntity & { playerCount: number }>;
    return entities.map((e) => this.toDomain(e));
  }

  async update(room: Room): Promise<Room> {
    await this.repository.save(this.toTypeOrm(room));
    return room;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(entity: RoomTypeOrmEntity & { playerCount?: number }): Room {
    return new Room(
      entity.id,
      entity.name,
      entity.shareCode,
      entity.createdAt,
      entity.updatedAt,
      entity.playerCount,
    );
  }

  private toTypeOrm(room: Room): RoomTypeOrmEntity {
    const entity = new RoomTypeOrmEntity();
    entity.id = room.id;
    entity.name = room.name;
    entity.shareCode = room.shareCode;
    entity.createdAt = room.createdAt;
    entity.updatedAt = room.updatedAt;
    return entity;
  }
}
