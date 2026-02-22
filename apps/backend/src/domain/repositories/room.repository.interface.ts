import { Room } from '../entities/room.entity';

export interface IRoomRepository {
  create(room: Room): Promise<Room>;
  findById(id: string): Promise<Room | null>;
  findByShareCode(shareCode: string): Promise<Room | null>;
  findAll(): Promise<Room[]>;
  update(room: Room): Promise<Room>;
  delete(id: string): Promise<void>;
}

export const ROOM_REPOSITORY = Symbol('ROOM_REPOSITORY');
