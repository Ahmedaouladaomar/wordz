import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { SessionService } from './session.service';
import { ApiConfigService } from '@/shared/services/api-config.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Session, RefreshToken]), UserModule],
  providers: [SessionService, ApiConfigService],
  exports: [SessionService],
})
export class SessionModule {}
