import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Vocabulary } from '../../vocabulary/entities/vocabulary.entity';
import { Practice } from '@/modules/practice/entities/practice.entity';
import { RefreshToken } from '@/modules/session/entities/refresh-token.entity';
import { Session } from '@/modules/session/entities/session.entity';
import { Exclude } from 'class-transformer';
import { RoleType } from '@/constants/role-type';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email!: string;

  @Column({ type: 'varchar', nullable: false })
  firstName!: string;

  @Column({ type: 'varchar', nullable: false })
  lastName!: string;

  @Column({ type: 'enum', nullable: false, enum: RoleType, default: RoleType.USER })
  role!: RoleType;

  @Exclude()
  @Column({ type: 'varchar', nullable: false })
  password!: string;

  @Column({ default: 5 })
  dailyTarget!: number;

  @Column({ default: false })
  isEmailVerified!: boolean;

  @Column({ type: 'varchar', nullable: true })
  emailVerificationToken?: string;

  @Column({ type: 'varchar', nullable: true })
  passwordResetToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  passwordResetExpires?: Date;

  @Column({ type: 'varchar', nullable: true })
  address?: string;

  @Column({ type: 'varchar', nullable: true })
  city?: string;

  @OneToMany(() => RefreshToken, (rt) => rt.user)
  refreshTokens?: RefreshToken[];

  @OneToMany(() => Session, (s) => s.user)
  sessions?: Session[];

  @OneToMany(() => Vocabulary, (v) => v.user)
  vocabularies?: Vocabulary[];

  @OneToMany(() => Practice, (p) => p.user)
  practices?: Practice[];
}
