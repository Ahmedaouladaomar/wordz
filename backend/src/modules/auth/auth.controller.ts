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
import { RequestResetPasswordDto } from '../user/dto/request-reset-password.dto';
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
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto, @UserAgent() userAgent: string) {
    const { email, code } = verifyEmailDto;
    return this.authService.verifyEmail(email, code, userAgent);
  }

  @Post('request-reset-password')
  @HttpCode(HttpStatus.OK)
  async requestResetPassword(@Body() requestResetPasswordDto: RequestResetPasswordDto) {
    await this.authService.requestResetPassword(requestResetPasswordDto.email);
    return {
      message: 'If an account with that email exists, a password reset code has been sent.',
    };
  }

  @Post('verify-reset-password-code')
  @HttpCode(HttpStatus.OK)
  async verifyResetPasswordCode(@Body() resetPasswordDto: ResetPasswordDto) {
    const result = await this.authService.verifyResetPasswordCode(
      resetPasswordDto.email,
      resetPasswordDto.code,
    );

    return !!result;
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @UserAgent() userAgent: string) {
    return await this.authService.resetPassword(resetPasswordDto, userAgent);
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
