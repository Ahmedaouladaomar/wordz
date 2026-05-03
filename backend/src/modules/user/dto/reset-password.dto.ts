import { IsNotEmpty, IsString, MinLength, Matches, IsEmail } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'Code must be exactly 6 digits' })
  code!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  newPassword!: string;
}
