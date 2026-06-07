import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { VocabularyModule } from '../vocabulary/vocabulary.module';
import { Practice } from './entities/practice.entity';
import { PracticeController } from './practice.controller';
import { PracticeService } from './practice.service';

@Module({
  imports: [TypeOrmModule.forFeature([Practice]), UserModule, VocabularyModule],
  controllers: [PracticeController],
  providers: [PracticeService],
})
export class PracticeModule {}
