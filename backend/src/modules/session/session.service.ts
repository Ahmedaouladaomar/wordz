import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Session } from './entities/session.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { ApiConfigService } from '@/shared/services/api-config.service';

@Injectable()
export class SessionService {
  constructor(
    private readonly configService: ApiConfigService,
    @InjectRepository(Session)
    private sessionRepo: Repository<Session>,
    @InjectRepository(RefreshToken)
    private tokenRepo: Repository<RefreshToken>,
  ) {}

  /**
   * Create a new device session and its first refresh token (Login)
   */
  async create(userId: string, userAgent: string) {
    const session = this.sessionRepo.create({ user: { id: userId }, userAgent });
    await this.sessionRepo.save(session);

    return session;
  }

  /**
   * Rotation: Marks old token as used and issues a new one for the same session
   */
  async rotateToken(sessionId: string, oldToken: string, newToken: string) {
    const session = await this.sessionRepo.findOne({
      where: { id: sessionId, isActive: true },
      relations: ['refreshTokens'],
    });

    if (!session) throw new UnauthorizedException('Session is no longer active.');

    // Find the current active token
    const activeRefreshToken = session.refreshTokens?.find(
      (t) => !t.isUsed && !t.isRevoked && new Date(t.expiresAt) > new Date(),
    );

    if (!activeRefreshToken) throw new UnauthorizedException('No active token found.');

    // Validate the incoming token against the stored hash
    const isMatch = await bcrypt.compare(oldToken, activeRefreshToken.token);

    if (!isMatch) {
      // SECURITY ALERT: Potential replay attack! Kill the entire session.
      await this.sessionRepo.update(sessionId, { isActive: false });
      throw new ForbiddenException('Security breach detected. All tokens revoked for this device.');
    }

    // Mark old token as used and add the new one
    activeRefreshToken.isUsed = true;
    await this.tokenRepo.save(activeRefreshToken);
    await this.updateRefreshToken(sessionId, newToken);
  }

  /**
   * Issuing a new refresh token for the session
   */
  async updateRefreshToken(sessionId: string, token: string) {
    const { saltRounds } = this.configService.bcryptConfig;
    const { refreshExpiresIn } = this.configService.authConfig;

    const tokenHash = await bcrypt.hash(token, saltRounds);

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + refreshExpiresIn);

    const refreshToken = this.tokenRepo.create({
      session: { id: sessionId },
      token: tokenHash,
      isUsed: false,
      isRevoked: false,
      expiresAt,
    });
    return this.tokenRepo.save(refreshToken);
  }

  /**
   * Explicit Logout: Deletes the session and all its tokens
   */
  async logout(sessionId: string) {
    return this.sessionRepo.delete(sessionId);
  }
}
