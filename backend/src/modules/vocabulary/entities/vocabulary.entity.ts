import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

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

  @ManyToOne(() => User, (user) => user.vocabularies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;
}
