import { IsNumber, IsString, Min } from 'class-validator';

export class CreatePracticeDto {
  @IsString()
  userId!: string;

  @IsString()
  practiceDate!: string;

  @IsNumber()
  @Min(1)
  totalWords: number = 0;
}
