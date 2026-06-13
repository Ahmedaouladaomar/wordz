import { IntersectionType } from '@nestjs/mapped-types';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { VocabularyFilterDto } from './vocabulary-filter.dto';

export class VocabularyQueryDto extends IntersectionType(PaginationQueryDto, VocabularyFilterDto) {}
