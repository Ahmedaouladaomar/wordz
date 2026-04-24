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

    const { expiresIn, refreshExpiresIn } = this.configService.authConfig;

    const accessTokenDto = new TokenDto(accessToken, expiresIn, TokenType.ACCESS_TOKEN);
    const refreshTokenDto = new TokenDto(refreshToken, refreshExpiresIn, TokenType.REFRESH_TOKEN);

    [accessTokenDto, refreshTokenDto].forEach((token) => {
      this.setTokenCookie(res, token);
    });

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

    const { expiresIn, refreshExpiresIn } = this.configService.authConfig;

    const accessTokenDto = new TokenDto(accessToken, expiresIn, TokenType.ACCESS_TOKEN);
    const refreshTokenDto = new TokenDto(refreshToken, refreshExpiresIn, TokenType.REFRESH_TOKEN);

    [accessTokenDto, refreshTokenDto].forEach((token) => {
      this.setTokenCookie(res, token);
    });

    return { accessToken };
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Headers('user-agent') userAgent: string) {
    return this.authService.register(registerDto, userAgent);
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

  private setTokenCookie(res: Response, token: TokenDto) {
    const cookieName = token.type;

    res.cookie(cookieName, token.value, {
      httpOnly: true,
      secure: false,
      maxAge: token.expiresIn * 1000, // Convert s to ms because maxAge expects ms
      path: '/',
    });
  }
}
