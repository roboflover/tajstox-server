import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateScoreDto } from './dto/update-score.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async updateScore(dto: UpdateScoreDto) {
    const score = parseFloat(dto.score);
    const newScore = score + 1;

    const updatedUser = await this.prisma.user.update({
      where: { telegramId: dto.telegramId },
      data: { score: newScore },
    });

    // Ищем, есть ли у пользователя реферер
    const referral = await this.prisma.referral.findFirst({
      where: { referrerId: updatedUser.id },
    });

    if (referral && referral.referrerId) {
      const bonus = score * 0.15; // 15% бонус
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