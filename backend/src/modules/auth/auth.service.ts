import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiConfigService } from '@/shared/services/api-config.service';
import { UserService } from '../user/user.service';
import { SessionService } from '../session/session.service';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private sessionService: SessionService,
    private jwtService: JwtService,
    private configService: ApiConfigService,
    private emailService: EmailService,
  ) {}

  /**
   * @description Validates credentials and creates a new Session
   * @param email
   * @param pass
   * @param userAgent
   * @returns
   */
  async login(email: string, pass: string, userAgent: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) throw new UnauthorizedException();

    // Create a new session entry in DB for this specific device
    const session = await this.sessionService.create(user.id, userAgent);

    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      user.email,
      session.id,
    );

    // Store the initial token for this session
    await this.sessionService.updateRefreshToken(session.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user,
      sessionId: session.id, // We store this in the JWT payload for rotation
    };
  }

  /**
   * @description Registers a new user and logs them in immediately
   * @param registerDto
   * @param userAgent
   * @returns
   */
  async register(registerDto: RegisterDto, userAgent: string) {
    // Check if user already exists
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Create the user in the database
    const user = await this.userService.create(registerDto);

    // Log them in immediately by creating a session
    return this.login(user.email, registerDto.password, userAgent);
  }

  async verifyEmail(email: string, token: string) {
    const user = await this.userService.findByEmail(email);
    const isMatch = token === user?.emailVerificationToken;
    if (!user || !isMatch) {
      throw new BadRequestException('Invalid verification token');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    return this.userService.save(user);
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = token;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 5); // Expires in 5 minutes
    await this.userService.save(user);

    const resetLink = `${this.configService.appConfig.frontendUrl}/reset-password?token=${token}`;
    await this.emailService.sendPasswordRecoveryEmail(
      user.email,
      `${user.firstName} ${user.lastName}`,
      resetLink,
    );
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userService.findByPasswordResetToken(token);
    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const { saltRounds } = this.configService.bcryptConfig;
    const salt = await bcrypt.genSalt(saltRounds);
    user.password = await bcrypt.hash(newPassword, salt);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    return this.userService.save(user);
  }

  /**
   * @description Validates the refresh token, rotates it, and issues new tokens
   * @param userId
   * @param sessionId
   * @param oldRefreshToken
   * @returns
   */
  async refreshToken(userId: string, sessionId: string, oldRefreshToken: string) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException();

    const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(
      user.id,
      user.email,
      sessionId,
    );

    // Perform the database rotation
    // We check if the 'oldRefreshToken' is valid/unused and hash the 'newRefreshToken'
    await this.sessionService.rotateToken(sessionId, oldRefreshToken, newRefreshToken);

    // Return both to the controller to be set as cookies
    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * @description Logs out the user by destroying their session
   * @param sessionId
   */
  async logout(sessionId: string) {
    await this.sessionService.logout(sessionId);
  }

  /**
   * @description Helper to generate JWTs
   * @param userId
   * @param email
   * @param sessionId
   * @returns accessToken and refreshToken
   */
  private async generateTokens(
    userId: string,
    email: string,
    sessionId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId, sessionId, email };

    const { privateKey, refreshKey, expiresIn, refreshExpiresIn } = this.configService.authConfig;

    // Note: We don't put the refreshToken in the payload;
    // it's a random string or a long-lived JWT.
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: privateKey,
        expiresIn: expiresIn * 1000, // Convert seconds to milliseconds
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshKey,
        expiresIn: refreshExpiresIn * 1000,
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
