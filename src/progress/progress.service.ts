import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { addDays, addMinutes, isAfter } from 'date-fns';

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
    console.log('Start updateDay', { telegramId, day, bonus, now });
  
    try {
      // Получаем прогресс пользователя
      let userProgress = await this.prisma.userProgress.findUnique({
        where: { telegramId },
      });
      console.log('Fetched userProgress', userProgress);
  
      if (!userProgress) {
        console.error('User progress not found for telegramId:', telegramId);
        throw new Error('User progress not found');
      }
  
      // Проверяем, прошло ли 24 часа с момента последнего взаимодействия
      // const canPerformAction = isAfter(now, addDays(userProgress.lastInteraction, 1));
      const canPerformAction = isAfter(now, addMinutes(userProgress.lastInteraction, 2));
      console.log('Check if action can be performed', { now, lastInteraction: userProgress.lastInteraction, canPerformAction });
  
      if (!canPerformAction) {
        console.error('Action can only be performed once every 24 hours', { telegramId });
        throw new Error('Action can only be performed once every 24 hours');
      }
  
      // Проверяем, совпадает ли текущий день с ожидаемым
      if (userProgress.currentStreak !== day) {
        console.error('Invalid day', { expectedDay: userProgress.currentStreak, providedDay: day });
        throw new Error('Invalid day');
      }
  
      // Получаем данные пользователя
      const user = await this.prisma.user.findUnique({
        where: { telegramId },
      });
      console.log('Fetched user', user);
  
      if (!user) {
        console.error('User not found for telegramId:', telegramId);
        throw new Error('User not found');
      }
  
      // Обновляем очки пользователя
      const updatedUser = await this.prisma.user.update({
        where: { telegramId },
        data: {
          score: user.score + bonus,
        },
      });
      console.log('Updated user score', { telegramId, newScore: updatedUser.score });
  
      // Рассчитываем следующий день
      const nextDay = day >= 15 ? 1 : day + 1;
      console.log('Calculated nextDay', { currentDay: day, nextDay });
  
      // Обновляем прогресс пользователя
      userProgress = await this.prisma.userProgress.update({
        where: { telegramId },
        data: {
          currentStreak: nextDay,
          lastInteraction: now,
        },
      });
      console.log('Updated userProgress', userProgress)
  
      return userProgress.currentStreak;
  
    } catch (error) {
      console.error('Error in updateDay', { telegramId, day, bonus, error });
      throw error; // Пробрасываем ошибку дальше
    }
  }
  
}