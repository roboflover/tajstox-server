import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateScoreDto } from './dto/update-score.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async updateScore(dto: UpdateScoreDto) {
    console.log(`Updating score for user with telegramId: ${dto.telegramId}`);

    const currentScoreData = await this.prisma.user.findUnique({
      where: { telegramId: dto.telegramId },
      select: { score: true },
    });

    if (!currentScoreData) {
      console.error(`User with telegramId ${dto.telegramId} not found`);
      throw new Error('User not found');
    }

    console.log(`Current score for user ${dto.telegramId}: ${currentScoreData.score}`);

    const newScore = currentScoreData.score + 1;

    const updatedUser = await this.prisma.user.update({
      where: { telegramId: dto.telegramId },
      data: { score: newScore },
    });

    console.log(`Updated score for user ${dto.telegramId}: ${newScore}`);
    console.log('updatedUser.id', updatedUser.id)

    // Ищем, если у пользователя есть реферер
    const referral = await this.prisma.referral.findFirst({
      where: { referredId: updatedUser.id },
    });

    if (referral && referral.referrerId) {
      console.log(`Referral found for user ${dto.telegramId}. Referrer ID: ${referral.referrerId}`);
      
      const bonus = 1 * 0.15; // 15% от добавленного очка
      await this.prisma.user.update({
        where: { id: referral.referrerId },
        data: { score: { increment: bonus } },
      });

      console.log(`Added bonus of ${bonus} to referrer with ID ${referral.referrerId}`);
    } else {
      console.log(`No referral found for user ${dto.telegramId}`);
    }

    return updatedUser;
  }

  async getScoreByUserId(userId: string): Promise<number> {
    console.log(`Fetching score for user with telegramId: ${userId}`);

    const user = await this.prisma.user.findUnique({
      where: { telegramId: userId },
      select: { score: true },
    });

    if (!user) {
      console.error(`User with telegramId ${userId} not found`);
      throw new Error('User not found');
    }

    console.log(`Score for user ${userId}: ${user.score}`);
    return user.score;
  }
}
