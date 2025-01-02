import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { addDays, addHours, differenceInHours, differenceInMinutes, isAfter } from 'date-fns';

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async getActiveDay(telegramId: string): Promise<number> {
    let userProgress = await this.prisma.userProgress.findUnique({
      where: { telegramId },
    });

    const now = new Date();

    if (!userProgress) {
      console.log(`[${telegramId}] No progress found. Creating new progress record.`);
      userProgress = await this.prisma.userProgress.create({
        data: { telegramId, lastInteraction: now, currentStreak: 1 },
      });
      return userProgress.currentStreak;
    }

    console.log(`[${telegramId}] Last interaction: ${userProgress.lastInteraction}`);
    console.log(`[${telegramId}] Current time: ${now}`);

    // Проверяем, прошло ли больше 24 часов с момента последнего взаимодействия
    if (isAfter(now, addDays(userProgress.lastInteraction, 1))) {
      console.log(`[${telegramId}] More than 24 hours passed since the last interaction.`);
      userProgress = await this.prisma.userProgress.update({
        where: { telegramId },
        data: { currentStreak: 1, lastInteraction: now },
      });
    }

    return userProgress.currentStreak;
  }

  async updateDay(telegramId: string, day: number, bonus: number): Promise<number> {
    const now = new Date();

    try {
      // Получаем прогресс пользователя
      let userProgress = await this.prisma.userProgress.findUnique({
        where: { telegramId },
      });

      if (!userProgress) {
        console.error(`[${telegramId}] User progress not found.`);
        throw new Error('User progress not found');
      }

      // Логируем время последнего взаимодействия
      console.log(`[${telegramId}] Last interaction: ${userProgress.lastInteraction}`);
      console.log(`[${telegramId}] Current time: ${now}`);
      
      // Рассчитываем разницу во времени
      const hoursSinceLastInteraction = differenceInHours(now, userProgress.lastInteraction);
      const minutesSinceLastInteraction = differenceInMinutes(now, userProgress.lastInteraction);

      console.log(
        `[${telegramId}] Time since last interaction: ${hoursSinceLastInteraction} hours (${minutesSinceLastInteraction} minutes)
      `);

      // Проверяем, прошло ли 24 часа с момента последнего взаимодействия
      const canPerformAction = isAfter(now, addHours(userProgress.lastInteraction, 24));
      if (!canPerformAction) {
        console.error(`[${telegramId}] Action can only be performed once every 24 hours.`);
        throw new Error('Action can only be performed once every 24 hours');
      }

      // Проверяем, совпадает ли текущий день с ожидаемым
      if (userProgress.currentStreak !== day) {
        console.error(`[${telegramId}] Invalid day. Expected: ${userProgress.currentStreak}, provided: ${day}`);
        throw new Error('Invalid day');
      }

      // Получаем данные пользователя
      const user = await this.prisma.user.findUnique({
        where: { telegramId },
      });

      if (!user) {
        console.error(`[${telegramId}] User not found.`);
        throw new Error('User not found');
      }

      // Обновляем очки пользователя
      const updatedUser = await this.prisma.user.update({
        where: { telegramId },
        data: { score: user.score + bonus },
      });

      console.log(`[${telegramId}] Updated user score. New score: ${updatedUser.score}`);

      // Рассчитываем следующий день
      const nextDay = day >= 15 ? 1 : day + 1;

      // Обновляем прогресс пользователя
      userProgress = await this.prisma.userProgress.update({
        where: { telegramId },
        data: { currentStreak: nextDay, lastInteraction: now },
      });

      console.log(`[${telegramId}] Updated progress. New streak: ${userProgress.currentStreak}, Next interaction time allowed after: ${addHours(now, 24)}`);

      return userProgress.currentStreak;
    } catch (error) {
      console.error(`[${telegramId}] Error in updateDay, {
        day,
        bonus,
        error,
      }`);
      throw error; // Пробрасываем ошибку дальше
    }
  }
}
