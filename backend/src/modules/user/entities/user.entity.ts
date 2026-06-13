import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Vocabulary } from '../../vocabulary/entities/vocabulary.entity';
import { Practice } from '@/modules/practice/entities/practice.entity';
import { RefreshToken } from '@/modules/session/entities/refresh-token.entity';
import { Session } from '@/modules/session/entities/session.entity';
import { Exclude, Expose } from 'class-transformer';
import { RoleType } from '@/constants/role-type';
import { USER_LEVELS } from '@/constants/user-levels';
import { type UserLevel } from '@/constants/user-levels';

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

  @Column({ default: 3 })
  dailyTarget!: number;

  @Column({ type: 'int', default: 0, nullable: false })
  streak!: number;

  @Column({ type: 'timestamptz', nullable: true })
  lastStreakIncrementDate?: Date;

  @Column({ default: false })
  isEmailVerified!: boolean;

  @Column({ type: 'varchar', nullable: true })
  emailVerificationCode?: string;

  @Column({ type: 'timestamp', nullable: true })
  emailVerificationCodeExpires?: Date;

  @Column({ type: 'varchar', nullable: true })
  passwordResetCode?: string;

  @Column({ type: 'timestamp', nullable: true })
  passwordResetCodeExpires?: Date;

  @Column({ type: 'varchar', nullable: true })
  address?: string;

  @Column({ type: 'varchar', nullable: true })
  city?: string;

  @Column({ type: 'varchar', nullable: true })
  googleId?: string;

  @Column({ default: false })
  isGoogleAuth!: boolean;

  @Expose()
  get level(): UserLevel {
    const sortedLevels = [...USER_LEVELS].sort((a, b) => b.totalWords - a.totalWords);
    const matchedLvl = sortedLevels.find((lvl) => this.totalWords >= lvl.totalWords);
    return matchedLvl || USER_LEVELS[USER_LEVELS.length - 1];
  }

  @Expose()
  get totalWords() {
    return this.vocabularies?.filter((v) => v.isMastered)?.length || 0;
  }

  @OneToMany(() => RefreshToken, (rt) => rt.user, { onDelete: 'CASCADE' })
  refreshTokens?: RefreshToken[];

  @OneToMany(() => Session, (s) => s.user, { onDelete: 'CASCADE' })
  sessions?: Session[];

  @OneToMany(() => Vocabulary, (v) => v.user, { onDelete: 'CASCADE' })
  vocabularies?: Vocabulary[];

  @OneToMany(() => Practice, (p) => p.user, { onDelete: 'CASCADE' })
  practices?: Practice[];
}
