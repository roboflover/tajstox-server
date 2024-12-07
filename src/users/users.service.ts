// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Предполагаем, что у вас есть PrismaService для доступа к базе данных
import { UpdateScoreDto } from './dto/update-score.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async updateScore(dto: UpdateScoreDto) {
    const score = parseInt(dto.score)
    const newScore = score + 1

    return this.prisma.user.update({
      where: { telegramId: dto.telegramId },
      data: { score: newScore },
    });
  }

  async getScoreByUserId(userId: string): Promise<number> {
    const user = await this.prisma.user.findUnique({
      where: { telegramId: userId },
      select: { score: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.score;
  }

}