import { Player } from '../entities/player.entity';

export interface IPlayerRepository {
  create(player: Player): Promise<Player>;
  findById(id: string): Promise<Player | null>;
  findByRoomId(roomId: string): Promise<Player[]>;
  update(player: Player): Promise<Player>;
  delete(id: string): Promise<void>;
}

export const PLAYER_REPOSITORY = Symbol('PLAYER_REPOSITORY');
