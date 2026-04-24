import { TokenType } from '@/constants/token-type';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class TokenDto {
  @IsString()
  value!: string;

  @IsNumber()
  expiresIn!: number;

  @IsEnum({ enum: TokenType })
  type!: TokenType;

  constructor(value: string, expiresIn: number, type: TokenType) {
    this.value = value;
    this.expiresIn = expiresIn;
    this.type = type;
  }
}
