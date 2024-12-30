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
      // Если запись прогресса для пользователя не существует, создаём новую
      userProgress = await this.prisma.userProgress.create({
        data: { telegramId, lastInteraction: now, currentStreak: 1 },
      });
      return userProgress.currentStreak;
    }

    // Проверяем, прошло ли больше суток с момента последнего действия
    if (isAfter(now, addDays(userProgress.lastInteraction, 1))) {
      // Сбрасываем последовательность дней
      userProgress = await this.prisma.userProgress.update({
        where: { telegramId },
        data: { currentStreak: 1, lastInteraction: now },
      });
    }

    return userProgress.currentStreak;
  }

  async updateDay(telegramId: string, day: number, bonus: number): Promise<number> {
    console.log(telegramId, day, bonus)
    // Получаем информацию о прогрессе пользователя
    let userProgress = await this.prisma.userProgress.findUnique({
      where: { telegramId },
    });
  
    if (!userProgress) {
      throw new Error('User progress not found');
    }
  
    // Проверяем, что отправленный день совпадает с текущей длиной цепочки
    if (userProgress.currentStreak !== day) {
      throw new Error('Invalid day');
    }
  
    // Находим пользователя по telegramId
    const user = await this.prisma.user.findUnique({
      where: { telegramId },
    });
  
    if (!user) {
      throw new Error('User not found');
    }
  
    // Обновляем score пользователя, добавляя к нему бонус
    await this.prisma.user.update({
      where: { telegramId },
      data: {
        score: user.score + bonus,
      },
    });
  
    // Обновляем день и дату взаимодействия
    const nextDay = day >= 15 ? 1 : day + 1; // Если день больше 15, сбрасываем на 1
    userProgress = await this.prisma.userProgress.update({
      where: { telegramId },
      data: {
        currentStreak: nextDay,
        lastInteraction: new Date(),
      },
    });
  
    return userProgress.currentStreak;
  }
  
}
