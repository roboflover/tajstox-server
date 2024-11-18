// src/users/dto/update-score.dto.ts
import { IsNumber, IsString } from 'class-validator';

export class UpdateScoreDto {
  @IsString()
  telegramId: number;

  @IsNumber()
  score: number;
}