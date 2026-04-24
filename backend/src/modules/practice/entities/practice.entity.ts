import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/user/entities/user.entity';

@Entity('practices')
export class Practice extends BaseEntity {
  @Column()
  score!: number;

  @Column()
  totalWords!: number;

  @Column({ type: 'jsonb', nullable: true })
  results!: any;

  @ManyToOne(() => User, (user) => user.practices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: string;
}
