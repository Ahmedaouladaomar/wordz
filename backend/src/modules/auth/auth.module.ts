import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { ApiConfigService } from '@/shared/services/api-config.service';
import { UserModule } from '../user/user.module';
import { EmailModule } from '../email/email.module';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [
    UserModule,
    EmailModule,
    SessionModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // Async registration to inject our ConfigService
    JwtModule.registerAsync({
      inject: [ApiConfigService],
      useFactory: (configService: ApiConfigService) => ({
        // Private Key is used here for signing new tokens
        privateKey: configService.authConfig.privateKey,
        signOptions: {
          expiresIn: configService.authConfig.expiresIn,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ApiConfigService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
