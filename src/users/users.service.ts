// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Предполагаем, что у вас есть PrismaService для доступа к базе данных
import { UpdateScoreDto } from './dto/update-score.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async updateScore(dto: UpdateScoreDto) {
    return this.prisma.user.update({
      where: { telegramId: dto.telegramId.toString() },
      data: { score: parseInt(dto.score) },
    });
  }

  async getScore(telegramId: string): Promise<number> {
    const user = await this.prisma.user.findUnique({  
      where: { telegramId: telegramId },
    });

    if (user) {
      console.log('user.score', user.score)
      return user.score;
    } else {
      throw new Error('User not found');
    }
  }

}