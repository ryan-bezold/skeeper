import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PlayerTypeOrmEntity } from './player.typeorm-entity';

@Entity('score_history')
export class ScoreHistoryTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'player_id' })
  playerId: string;

  @ManyToOne(() => PlayerTypeOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'player_id' })
  player: PlayerTypeOrmEntity;

  @Column({ name: 'previous_score', type: 'integer' })
  previousScore: number;

  @Column({ name: 'new_score', type: 'integer' })
  newScore: number;

  @Column({ name: 'change_amount', type: 'integer' })
  changeAmount: number;

  @Column({ name: 'change_type' })
  changeType: 'increment' | 'decrement' | 'set';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
