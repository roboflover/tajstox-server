// src/users/dto/update-score.dto.ts
import { IsString } from 'class-validator';

export class UpdateScoreDto {
  @IsString()
  telegramId: string;

  @IsString()
  score: string;
}