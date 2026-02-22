import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RoomTypeOrmEntity } from './room.typeorm-entity';

@Entity('players')
export class PlayerTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'integer', default: 0 })
  score: number;

  @Column({ name: 'room_id' })
  roomId: string;

  @ManyToOne(() => RoomTypeOrmEntity, (room) => room.players, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'room_id' })
  room: RoomTypeOrmEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
