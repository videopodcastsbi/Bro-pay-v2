import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class WithdrawDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: 'Amount must be at least 1' })
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;
}
