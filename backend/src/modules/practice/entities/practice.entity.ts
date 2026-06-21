import { Entity, Column, ManyToOne, JoinColumn, Unique, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/user/entities/user.entity';
import { Vocabulary } from '@/modules/vocabulary/entities/vocabulary.entity';

@Entity('practices')
@Unique(['userId', 'practiceDate'])
export class Practice extends BaseEntity {
  @Column({ type: 'boolean', default: false })
  isCompleted!: boolean;

  @Column()
  totalWords!: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  practiceDate?: string;

  @ManyToOne(() => User, (user) => user.practices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToMany(() => Vocabulary, (vocabulary) => vocabulary.practices)
  @JoinTable()
  vocabularies?: Vocabulary[];

  @Column()
  userId!: string;
}
