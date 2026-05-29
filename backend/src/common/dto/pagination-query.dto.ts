import { IsInt, Min, IsOptional, IsEnum, IsString, Max } from 'class-validator';
import { Type } from 'class-transformer';

enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  take: number = 10;

  @IsOptional()
  @IsString()
  orderBy?: string;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder = SortOrder.DESC;

  @IsOptional()
  @IsString()
  search?: string;
}
