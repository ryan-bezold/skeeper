import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { PlayerTypeOrmEntity } from './player.typeorm-entity';

@Entity('rooms')
export class RoomTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'share_code', unique: true })
  shareCode: string;

  @OneToMany(() => PlayerTypeOrmEntity, (player) => player.room, {
    cascade: true,
  })
  players: PlayerTypeOrmEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
