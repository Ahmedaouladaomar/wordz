import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { AuthGuard } from '@/guards/auth.guard';
import { AuthUser } from '@/decorators/auth-user.decorator';
import { User } from '@/modules/user/entities/user.entity';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';

@UseGuards(AuthGuard())
@Controller('vocabulary')
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Post()
  create(@Body() createVocabularyDto: CreateVocabularyDto, @AuthUser() user: User) {
    return this.vocabularyService.create(createVocabularyDto, user.id);
  }

  @Get()
  findAll(
    @AuthUser() user: User,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return this.vocabularyService.findAll(user.id, paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @AuthUser() user: User) {
    return this.vocabularyService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVocabularyDto: UpdateVocabularyDto,
    @AuthUser() user: User,
  ) {
    return this.vocabularyService.update(id, updateVocabularyDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @AuthUser() user: User) {
    return this.vocabularyService.remove(id, user.id);
  }
}
