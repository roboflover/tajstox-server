import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateScoreDto } from './dto/update-score.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async updateScore(dto: UpdateScoreDto) {
    const currentScoreData = await this.prisma.user.findUnique({
      where: { telegramId: dto.telegramId },
      select: { score: true },
    });

    if (!currentScoreData) {
      throw new Error('User not found');
    }

    const newScore = currentScoreData.score + 1;

    const updatedUser = await this.prisma.user.update({
      where: { telegramId: dto.telegramId },
      data: { score: newScore },
    });

    // Ищем, если у пользователя есть реферер
    const referral = await this.prisma.referral.findFirst({
      where: { referredId: updatedUser.id },
    });

    if (referral && referral.referrerId) {
      const bonus = 1 * 0.15; // 15% от добавленного очка
      await this.prisma.user.update({
        where: { id: referral.referrerId },
        data: { score: { increment: bonus } },
      });
    }

    return updatedUser;
  }

  async getScoreByUserId(userId: string): Promise<number> {
    const user = await this.prisma.user.findUnique({
      where: { telegramId: userId },
      select: { score: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.score;
  }
}