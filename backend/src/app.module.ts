import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Feature Modules
import { UserModule } from './modules/user/user.module';
import { PracticeModule } from './modules/practice/practice.module';
import { VocabularyModule } from './modules/vocabulary/vocabulary.module';
import { AuthModule } from './modules/auth/auth.module';
import { SessionModule } from './modules/session/session.module';

// Shared/Config
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    // 1. Initialize ConfigModule to load .env files
    ConfigModule.forRoot({
      isGlobal: true,
      // Automatically picks the right .env file based on NODE_ENV
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),

    // 2. Database Factory: Dynamic connection using ApiConfigService
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [ApiConfigService],
      useFactory: (configService: ApiConfigService) => configService.postgresConfig,
    }),

    // 3. Application Modules
    SharedModule,
    UserModule,
    PracticeModule,
    VocabularyModule,
    AuthModule,
    SessionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
