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
import { RegisterDto } from './dto/register.dto';
import { User } from '../user/entities/user.entity';
import { ResetPasswordDto } from '../user/dto/reset-password.dto';

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

    if (!user.isEmailVerified) throw new BadRequestException('Please verify email!');

    return this.createAuthenticatedSession(user, userAgent);
  }

  /**
   * @description Registers a new user
   * @param registerDto
   * @returns
   */
  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Create the user in the database
    await this.userService.create(registerDto);

    return true;
  }

  /**
   * SHARED HELPER: Handles session DB entry and JWT generation
   */
  private async createAuthenticatedSession(user: User, userAgent: string) {
    const session = await this.sessionService.create(user.id, userAgent);

    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      user.email,
      session.id,
    );

    await this.sessionService.updateRefreshToken(session.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user,
      sessionId: session.id,
    };
  }

  async verifyEmail(email: string, code: string, userAgent: string) {
    const user = await this.userService.findByEmail(email);

    const isValid =
      user &&
      user.emailVerificationCodeExpires &&
      new Date() < user.emailVerificationCodeExpires &&
      code === user?.emailVerificationCode;

    if (!isValid) {
      throw new BadRequestException('Invalid verification code');
    }

    user.isEmailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationCodeExpires = undefined;

    await this.userService.save(user);

    return await this.createAuthenticatedSession(user, userAgent);
  }

  async requestResetPassword(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return;
    }

    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.passwordResetCode = code;
    user.passwordResetCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // Expires in 15 minutes
    await this.userService.save(user);

    await this.emailService.sendPasswordRecoveryEmail(
      user.email,
      `${user.firstName} ${user.lastName}`,
      code,
    );
  }

  async verifyResetPasswordCode(email: string, code: string): Promise<User> {
    const user = await this.userService.findByEmail(email);

    if (
      !user ||
      !user.passwordResetCodeExpires ||
      user.passwordResetCodeExpires < new Date() ||
      user.passwordResetCode !== code
    ) {
      throw new BadRequestException('Invalid or expired reset code');
    }

    // Elswise we return user
    return user;
  }

  async resetPassword(resetPassworDto: ResetPasswordDto, userAgent: string) {
    const user = await this.verifyResetPasswordCode(resetPassworDto.email, resetPassworDto.code);

    const { saltRounds } = this.configService.bcryptConfig;
    const salt = await bcrypt.genSalt(saltRounds);
    user.password = await bcrypt.hash(resetPassworDto.newPassword, salt);
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpires = undefined;

    const savedUser = await this.userService.save(user);

    return this.createAuthenticatedSession(savedUser, userAgent);
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
