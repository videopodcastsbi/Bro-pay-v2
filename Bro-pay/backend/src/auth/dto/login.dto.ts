import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @IsNotEmpty({ message: 'Email or username is required' })
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  email: string; // accepts email or username

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MaxLength(100)
  password: string;
}
