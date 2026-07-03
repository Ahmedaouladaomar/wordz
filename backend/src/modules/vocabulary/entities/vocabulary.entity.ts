import { BaseEntity } from '@/common/entities/base.entity';
import { Practice } from '@/modules/practice/entities/practice.entity';
import { User } from '@/modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';

@Entity('vocabularies')
export class Vocabulary extends BaseEntity {
  @Column()
  term!: string;

  @Column()
  definition!: string;

  @Column()
  example!: string;

  @Column()
  userId!: string;

  @Column({ type: 'boolean', default: false })
  isFavourite!: boolean;

  @Column({ type: 'boolean', default: false })
  isMastered!: boolean;

  @ManyToOne(() => User, (user) => user.vocabularies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToMany(() => Practice, (practice) => practice.vocabularies)
  practices?: Practice[];
}
