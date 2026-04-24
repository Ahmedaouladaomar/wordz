import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Vocabulary } from '../../vocabulary/entities/vocabulary.entity';
import { Practice } from '@/modules/practice/entities/practice.entity';
import { RefreshToken } from '@/modules/session/entities/refresh-token.entity';
import { Session } from '@/modules/session/entities/session.entity';
import { RoleType } from '@/constants/role-type';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email!: string;

  @Column({ type: 'varchar', nullable: false })
  firstName!: string;

  @Column({ type: 'varchar', nullable: false })
  lastName!: string;

  @Exclude()
  @Column({ type: 'varchar', nullable: false })
  password!: string;

  @Column({ default: 5 })
  dailyTarget!: number;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role!: RoleType;

  @Column()
  city?: string;

  @Column()
  address?: string;

  @OneToMany(() => RefreshToken, (rt) => rt.user)
  refreshTokens?: RefreshToken[];

  @OneToMany(() => Session, (s) => s.user)
  sessions?: Session[];

  @OneToMany(() => Vocabulary, (v) => v.user)
  vocabularies?: Vocabulary[];

  @OneToMany(() => Practice, (p) => p.user)
  practices?: Practice[];
}
