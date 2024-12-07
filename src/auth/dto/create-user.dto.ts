// src/auth/dto/create-user.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  telegramId: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsDateString()
  @IsNotEmpty()
  authDate: string;

  @IsString()
  @IsNotEmpty()
  authPayload: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsInt()
  @IsOptional()
  score?: number;

  @IsInt()
  @IsOptional()
  referrerId?: number;

  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;

  @IsString()
  @IsOptional()
  role?: string;
}
