import { AuthGuard } from '@/guards/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreatePracticeDto } from './dto/create-practice.dto';
import { UpdatePracticeDto } from './dto/update-practice.dto';
import { PracticeService } from './practice.service';
import { AuthUser } from '@/decorators/auth-user.decorator';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';

@UseGuards(AuthGuard())
@Controller('practice')
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  @Post()
  create(@Body() createPracticeDto: CreatePracticeDto) {
    return this.practiceService.create(createPracticeDto);
  }

  @Get()
  findAll() {
    return this.practiceService.findAll();
  }

  @Post('today')
  todayPractice(@AuthUser() user: AuthUserDto) {
    return this.practiceService.todayPractice(user.id);
  }

  @Get('unmastered')
  getPracticeTerms(@AuthUser() user: AuthUserDto, @Query() paginationQueryDto: PaginationQueryDto) {
    return this.practiceService.getUnmasteredTerms(user.id, paginationQueryDto);
  }

  @Post(':id/complete')
  completePractice(@Param('id') id: string) {
    return this.practiceService.completePractice(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.practiceService.findOne(id);
  }

  @Patch('/total-words/:id')
  updateTotalWords(
    @Param('id') id: string,
    @Body()
    updateTotalWordsDto: {
      totalWords: number;
      vocabularyId: string;
    },
  ) {
    return this.practiceService.updateTotalWords(id, updateTotalWordsDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePracticeDto: UpdatePracticeDto) {
    return this.practiceService.update(id, updatePracticeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.practiceService.remove(id);
  }
}
