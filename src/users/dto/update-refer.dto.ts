// src/users/dto/update-score.dto.ts
import { IsString } from 'class-validator';

export class UpdateReferDto {
  @IsString()
  telegramId: string;

  @IsString()
  referralCode: string;
}