import {
  Controller,
  Post,
  Body,
  UseGuards,
  Headers,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@/guards/auth.guard';
import { LoginDto } from './dto/login.dto';
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
  constructor(private readonly authService: AuthService) {}

  @SerializeOptions({ groups: ['users'] })
  @Post('login')
  async login(@Body() loginDto: LoginDto, @UserAgent() userAgent: string) {
    const { accessToken, refreshToken, user } = await this.authService.login(
      loginDto.email,
      loginDto.password,
      userAgent,
    );

    return { user, accessToken, refreshToken };
  }

  @UseGuards(AuthGuard({ refreshToken: true }))
  @Post('refresh')
  async refresh(@AuthUser() user: AuthUserDto) {
    const { userId, sessionId, refreshToken: ort } = user;

    const { accessToken, refreshToken } = await this.authService.refreshToken(
      userId,
      sessionId,
      ort,
    );

    return { accessToken, refreshToken };
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
  async logout(@AuthUser() user: AuthUserDto) {
    console.log(user);
    const { sessionId } = user;
    await this.authService.logout(sessionId);

    return { message: 'Logged out successfully' };
  }
}
