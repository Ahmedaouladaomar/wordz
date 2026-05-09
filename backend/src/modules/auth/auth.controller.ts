import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
  HttpCode,
  HttpStatus,
  Get,
  NotFoundException,
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
import { ApiResponseDto } from '@/common/dto/api-response.dto';
import { RefreshDto } from './dto/refresh.dto';
import { UserService } from '../user/user.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

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

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard())
  async getMe(@AuthUser() user: AuthUserDto): Promise<ApiResponseDto<AuthUserDto>> {
    console.log(user);
    const freshUser = await this.userService.findOne(user.userId);

    if (!freshUser) {
      throw new NotFoundException('User not found');
    }

    const authUser = new AuthUserDto({
      ...freshUser,
      userId: freshUser.id,
      sessionId: user.sessionId,
      refreshToken: user.refreshToken,
    } as any);

    return new ApiResponseDto(authUser);
  }

  @UseGuards(AuthGuard({ refreshToken: true }))
  @Post('refresh')
  async refresh(@AuthUser() user: RefreshDto) {
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

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerification(@Body() body: { email: string }) {
    return this.authService.resendVerificationEmail(body.email);
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
    const response = new ApiResponseDto(null);
    response.message = 'If an account with that email exists, a password reset code has been sent.';
    response.success = true;
    return response;
  }

  @Post('verify-reset-password-code')
  @HttpCode(HttpStatus.OK)
  async verifyResetPasswordCode(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.verifyResetPasswordCode(resetPasswordDto.email, resetPasswordDto.code);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @UserAgent() userAgent: string) {
    return this.authService.resetPassword(resetPasswordDto, userAgent);
  }

  @UseGuards(AuthGuard())
  @Post('logout')
  async logout(@AuthUser() user: AuthUserDto) {
    const { sessionId } = user;
    await this.authService.logout(sessionId);

    return { message: 'Logged out successfully' };
  }
}
