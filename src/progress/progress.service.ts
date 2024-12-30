import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { addDays, isAfter } from 'date-fns';

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async getActiveDay(telegramId: string): Promise<number> {
    let userProgress = await this.prisma.userProgress.findUnique({
      where: { telegramId },
    });

    const now = new Date();

    if (!userProgress) {
      userProgress = await this.prisma.userProgress.create({
        data: { telegramId, lastInteraction: now, currentStreak: 1 },
      });
      return userProgress.currentStreak;
    }

    if (isAfter(now, addDays(userProgress.lastInteraction, 1))) {
      userProgress = await this.prisma.userProgress.update({
        where: { telegramId },
        data: { currentStreak: 1, lastInteraction: now },
      });
    }

    return userProgress.currentStreak;
  }

  async updateDay(telegramId: string, day: number, bonus: number): Promise<number> {
    const now = new Date();
    
    let userProgress = await this.prisma.userProgress.findUnique({
      where: { telegramId },
    });

    if (!userProgress) {
      throw new Error('User progress not found');
    }

    // Ensure the action is performed only once per 24 hours period
    if (!isAfter(now, addDays(userProgress.lastInteraction, 1))) {
      throw new Error('Action can only be performed once every 24 hours');
    }

    if (userProgress.currentStreak !== day) {
      throw new Error('Invalid day');
    }

    const user = await this.prisma.user.findUnique({
      where: { telegramId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    await this.prisma.user.update({
      where: { telegramId },
      data: {
        score: user.score + bonus,
      },
    });

    const nextDay = day >= 15 ? 1 : day + 1;
    userProgress = await this.prisma.userProgress.update({
      where: { telegramId },
      data: {
        currentStreak: nextDay,
        lastInteraction: now,
      },
    });

    return userProgress.currentStreak;
  }
}