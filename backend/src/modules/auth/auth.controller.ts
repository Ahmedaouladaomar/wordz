import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Headers,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from '@/guards/auth.guard';
import { TokenType } from '@/constants/token-type';
import { LoginDto } from './dto/login.dto';
import { ApiConfigService } from '@/shared/services/api-config.service';
import { TokenDto } from './dto/token.dto';
import { AuthUser } from '@/decorators/auth-user.decorator';
import { AuthUserDto } from './dto/auth-user.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from '../user/dto/verify-email.dto';
import { RequestPasswordResetDto } from '../user/dto/request-password-reset.dto';
import { ResetPasswordDto } from '../user/dto/reset-password.dto';
import { UserAgent } from '@/decorators/user-agent.decorator';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ApiConfigService,
  ) {}

  @SerializeOptions({ groups: ['users'] })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @UserAgent() userAgent: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } = await this.authService.login(
      loginDto.email,
      loginDto.password,
      userAgent,
    );

    this.setAuthCookies(res, { accessToken, refreshToken });

    return { user, accessToken };
  }

  @UseGuards(AuthGuard({ refreshToken: true }))
  @Post('refresh')
  async refresh(@AuthUser() user: AuthUserDto, @Res({ passthrough: true }) res: Response) {
    const { userId, sessionId, refreshToken: ort } = user;

    const { accessToken, refreshToken } = await this.authService.refreshToken(
      userId,
      sessionId,
      ort,
    );

    this.setAuthCookies(res, { accessToken, refreshToken });

    return { accessToken };
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Headers('user-agent') userAgent: string) {
    return this.authService.register(registerDto, userAgent);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    const { email, token } = verifyEmailDto;
    return await this.authService.verifyEmail(email, token);
  }

  @Post('request-password-reset')
  @HttpCode(HttpStatus.OK)
  async requestPasswordReset(@Body() requestPasswordResetDto: RequestPasswordResetDto) {
    await this.authService.requestPasswordReset(requestPasswordResetDto.email);
    return {
      message: 'If an account with that email exists, a password reset link has been sent.',
    };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }

  @UseGuards(AuthGuard())
  @Post('logout')
  async logout(@AuthUser() user: AuthUserDto, @Res({ passthrough: true }) res: Response) {
    const { sessionId } = user;
    await this.authService.logout(sessionId);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth',
    });

    return { message: 'Logged out successfully' };
  }

  /**
   * Private helper to set auth tokens as http cookies
   * @param res
   * @param tokens
   */
  private setAuthCookies(res: Response, tokens: { accessToken: string; refreshToken: string }) {
    const { accessToken, refreshToken } = tokens;
    const { expiresIn, refreshExpiresIn } = this.configService.authConfig;

    const accessTokenDto = new TokenDto(accessToken, expiresIn, TokenType.ACCESS_TOKEN);
    const refreshTokenDto = new TokenDto(refreshToken, refreshExpiresIn, TokenType.REFRESH_TOKEN);

    [accessTokenDto, refreshTokenDto].forEach((token) => {
      res.cookie(token.type, token.value, {
        httpOnly: true,
        secure: false,
        maxAge: token.expiresIn * 1000, // Convert s to ms because maxAge expects ms
        path: '/',
      });
    });
  }
}
