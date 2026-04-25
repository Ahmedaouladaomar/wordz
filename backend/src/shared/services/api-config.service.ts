import path from 'node:path';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  private getNumber(key: string): number {
    const value = this.get(key);
    const num = Number(value);

    if (Number.isNaN(num)) {
      throw new TypeError(`Environment variable ${key} must be a number. Received: ${value}`);
    }

    return num;
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(`Environment variable ${key} must be a boolean. Received: ${value}`);
    }
  }

  private getString(key: string, defaultValue?: string): string {
    const value = this.configService.get<string>(key);

    if (value === undefined) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }

      throw new Error(`${key} environment variable doesn't exist`);
    }

    return value.toString().replaceAll(String.raw`\n`, '\n');
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get postgresConfig(): TypeOrmModuleOptions {
    const entities = [
      path.join(__dirname, `../../modules/**/*.entity{.ts,.js}`),
      path.join(__dirname, `../../modules/**/*.view-entity{.ts,.js}`),
    ];
    const migrations = [path.join(__dirname, `../../database/migrations/*{.ts,.js}`)];
    const subscribers = [path.join(__dirname, `../../common/entity-subscribers/*{.ts,.js}`)];

    return {
      entities,
      migrations,
      subscribers,
      dropSchema: this.isTest,
      type: 'postgres',
      host: this.getString('DB_HOST'),
      port: this.getNumber('DB_PORT'),
      username: this.getString('DB_USERNAME'),
      password: this.getString('DB_PASSWORD'),
      database: this.getString('DB_DATABASE'),
      logging: this.getBoolean('ENABLE_ORM_LOGS'),
    };
  }

  get authConfig() {
    return {
      privateKey: this.getString('JWT_PRIVATE_KEY'),
      refreshKey: this.getString('JWT_REFRESH_KEY'),
      expiresIn: this.getNumber('JWT_EXPIRES_IN'),
      refreshExpiresIn: this.getNumber('JWT_REFRESH_EXPIRES_IN'),
    };
  }

  get bcryptConfig() {
    return {
      saltRounds: this.getNumber('BCRYPT_SALT_ROUNDS'),
    };
  }

  get emailConfig() {
    return {
      resendApiKey: this.getString('RESEND_API_KEY'),
      emailFrom: this.getString('EMAIL_FROM'),
    };
  }

  get appConfig() {
    return {
      port: this.getString('PORT'),
      frontendUrl: this.getString('FRONTEND_URL'),
    };
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (value == null) {
      throw new Error(`Environment variable ${key} is not set`);
    }

    return value;
  }
}
