import { IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateVocabularyDto {
  @IsString()
  @IsNotEmpty()
  term!: string;

  @IsString()
  @IsNotEmpty()
  definition!: string;

  @IsString()
  @IsNotEmpty()
  example!: string;

  @IsBoolean()
  @IsOptional()
  isMastered?: boolean;

  @IsBoolean()
  @IsOptional()
  isFavourite?: boolean;
}
