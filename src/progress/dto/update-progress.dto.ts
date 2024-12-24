// src/prigress/dto/update-score.dto.ts
import { IsString } from 'class-validator';

export class UpdateProgressDto {
  @IsString()
  telegramId: string;

  @IsString()
  referralCode: string;
}