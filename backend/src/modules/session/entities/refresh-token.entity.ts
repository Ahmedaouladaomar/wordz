import { BaseEntity } from '@/common/entities/base.entity';
import { Session } from '@/modules/session/entities/session.entity';
import { User } from '@/modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('refresh_tokens')
export class RefreshToken extends BaseEntity {
  @Column()
  token!: string;

  @Column()
  expiresAt!: Date;

  @Column({ default: false })
  isRevoked!: boolean;

  @Column({ default: false })
  isUsed!: boolean;

  @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Session, (session) => session.refreshTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sessionId' })
  session!: Session;
}
