import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { ApiConfigService } from '@/shared/services/api-config.service';
import { UserService } from '../user/user.service';
import { SessionService } from '../session/session.service';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '../user/entities/user.entity';
import { ResetPasswordDto } from '../user/dto/reset-password.dto';
import { validateHash } from '@/common/utils/hash-generator';

@Injectable()
export class AuthService {
  private googleAuthClient: OAuth2Client;

  constructor(
    private userService: UserService,
    private sessionService: SessionService,
    private jwtService: JwtService,
    private configService: ApiConfigService,
    private emailService: EmailService,
  ) {
    const { clientId } = this.configService.googleAuthConfig;
    this.googleAuthClient = new OAuth2Client(clientId);
  }

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

    if (user.isGoogleAuth && !user.password) {
      throw new BadRequestException(
        "This account is associated with Google authentication. Please log in with Google. If you want to set a password, please use the 'Forgot Password' feature.",
      );
    }

    const isMatch = await validateHash(pass, user.password);
    if (!isMatch) throw new UnauthorizedException();

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

  async resendVerificationEmail(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }
    await this.userService.sendVerificationEmail(user);
    return { message: 'Verification email sent' };
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

    user.password = resetPassworDto.newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpires = undefined;

    const savedUser = await this.userService.save(user);

    return await this.createAuthenticatedSession(savedUser, userAgent);
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
   * @description Handles Google OAuth login/signup for mobile apps
   * @param tokenId - ID token from Google (from mobile Expo app)
   * @param userAgent - User agent string
   * @returns accessToken, refreshToken, and user info
   */
  async googleAuth(tokenId: string, userAgent: string) {
    const { clientId } = this.configService.googleAuthConfig;
    try {
      // Verify the Google token
      const ticket = await this.googleAuthClient.verifyIdToken({
        idToken: tokenId,
        audience: clientId,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid Google token');
      }

      const { sub: googleId, email, given_name: firstName, family_name: lastName } = payload;

      if (!email) {
        throw new UnauthorizedException('Google account does not have an email');
      }

      // Check if user exists by Google ID
      const user = await this.userService.findByGoogleId(googleId);

      if (user) {
        // Existing Google user - just create a new session
        return this.createAuthenticatedSession(user, userAgent);
      }

      // Check if user exists by email
      const existingUser = await this.userService.findByEmail(email);

      if (existingUser) {
        // User exists but not through Google OAuth
        // Link Google account to existing user
        existingUser.googleId = googleId;
        existingUser.isGoogleAuth = true;
        await this.userService.save(existingUser);
        return this.createAuthenticatedSession(existingUser, userAgent);
      }

      // Create new user with Google OAuth
      const newUser = await this.userService.create({
        email,
        firstName: firstName || 'User',
        lastName: lastName || '',
        password: '', // Google users don't have a password
        googleId,
        isGoogleAuth: true,
        isEmailVerified: true, // Google email is already verified
      } as RegisterDto);

      return this.createAuthenticatedSession(newUser, userAgent);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Google authentication failed');
    }
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

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: privateKey,
        expiresIn: expiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshKey,
        expiresIn: refreshExpiresIn,
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
