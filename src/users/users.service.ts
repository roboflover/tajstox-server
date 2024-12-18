import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateScoreDto } from './dto/update-score.dto';
import { UpdateReferDto } from './dto/update-refer.dto';

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
    console.log('updatedUser.telegramId', updatedUser.telegramId)

    // Ищем, если у пользователя есть реферер
    const referral = await this.prisma.referral.findFirst({
      where: { referredId: updatedUser.id },
    });

    if (referral && referral.referrerId) {
      console.log(`Referral found for user ${dto.telegramId}. Referrer ID: ${referral.referrerId}`);
      
      const bonus = 1 * 0.15; 
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

  async updateRefer(updateReferDto: UpdateReferDto) {
    const { telegramId, referralCode } = updateReferDto;

    // Получение пользователя, который делает реферальное приглашение
    const referrer = await this.prisma.user.findUnique({
      where: { telegramId },
    });

    if (!referrer) {
      throw new BadRequestException('Referrer not found');
    }

    // Получение пользователя, который был приглашен
    const referred = await this.prisma.user.findUnique({
      where: { telegramId: referralCode },
    });

    if (!referred) {
      throw new BadRequestException('Referred user not found');
    }

    // Проверка, нет ли уже реферальной записи между этими пользователями
    const existingReferral = await this.prisma.referral.findFirst({
      where: {
        referrerId: referrer.id,
        referredId: referred.id,
      },
    });

    if (existingReferral) {
      throw new BadRequestException('Referral already exists');
    }

    // Создание новой реферальной записи
    const referral = await this.prisma.referral.create({
      data: {
        referrerId: referrer.id,
        referredId: referred.id,
      },
    });

    return referral;
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
  
  async getReferralCount(telegramId: string): Promise<number> {
    // Предполагается, что у вас есть User модель, которая содержит рефералы
    const user = await this.prisma.user.findUnique({
      where: { telegramId },
      include: { referrals: true }, // Предполагается, что есть отношение 'referrals'
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.referrals.length;
  }
  
}

