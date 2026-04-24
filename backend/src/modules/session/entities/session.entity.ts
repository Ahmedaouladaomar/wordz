import { BaseEntity } from '@/common/entities/base.entity';
import { RefreshToken } from '@/modules/session/entities/refresh-token.entity';
import { User } from '@/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('sessions')
export class Session extends BaseEntity {
  @Column()
  userAgent?: string;

  @Column({ default: true })
  isActive?: boolean;

  @OneToMany(() => RefreshToken, (rt) => rt.session)
  refreshTokens?: RefreshToken[];

  @ManyToOne(() => User, (user) => user.sessions)
  user?: User;
}
