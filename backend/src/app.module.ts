import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Feature Modules
import { UserModule } from './modules/user/user.module';
import { PracticeModule } from './modules/practice/practice.module';
import { VocabularyModule } from './modules/vocabulary/vocabulary.module';
import { AuthModule } from './modules/auth/auth.module';
import { SessionModule } from './modules/session/session.module';
import { EmailModule } from './modules/email/email.module';

// Shared/Config
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/global-exceptions.filter';

@Module({
  imports: [
    // Shared/Config
    SharedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      // Automatically picks the right .env file based on NODE_ENV
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),

    // ORM Module
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [ApiConfigService],
      useFactory: (configService: ApiConfigService) => configService.postgresConfig,
    }),

    // Application Modules
    UserModule,
    PracticeModule,
    VocabularyModule,
    AuthModule,
    SessionModule,
    EmailModule,
  ],
  controllers: [],
  providers: [
    // Registering exceptions filter globally
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
