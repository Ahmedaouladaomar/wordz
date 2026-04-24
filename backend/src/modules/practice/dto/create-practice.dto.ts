import { IsNumber, Min } from 'class-validator';

export class CreatePracticeDto {
  @IsNumber()
  @Min(0)
  score: number = 0;

  @IsNumber()
  @Min(1)
  totalWords: number = 0;
}
