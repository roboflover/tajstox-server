import { Injectable } from '@nestjs/common';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { PrismaService } from '../prisma/prisma.service'; // Сервис Prisma

@Injectable()
export class ProgressService {
  
  constructor(private readonly prisma: PrismaService) {}

  async handleDailyInteraction(updateProgressDto: UpdateProgressDto): Promise<string> {

    const { telegramId } = updateProgressDto;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Убираем время для сравнения только по дате

    // Находим прогресс пользователя
    let userProgress = await this.prisma.userProgress.findUnique({
      where: { telegramId },
    });

    if (!userProgress) {
      // Если пользователь взаимодействует впервые
      userProgress = await this.prisma.userProgress.create({
        data: {
          telegramId,
          lastInteraction: today,
          currentStreak: 1,
        },
      });
      return 'Вы начали новый прогресс! День 1.';
    }

    const lastInteraction = new Date(userProgress.lastInteraction);
    lastInteraction.setHours(0, 0, 0, 0);

    const diffInDays = (today.getTime() - lastInteraction.getTime()) / (1000 * 3600 * 24);

    if (diffInDays === 1) {
      // Пользователь взаимодействовал на следующий день
      userProgress = await this.prisma.userProgress.update({
        where: { telegramId },
        data: {
          currentStreak: userProgress.currentStreak + 1,
          lastInteraction: today,
        },
      });

      if (userProgress.currentStreak === 30) {
        // Завершен цикл из 30 дней
        userProgress = await this.prisma.userProgress.update({
          where: { telegramId },
          data: {
            completedStreaks: userProgress.completedStreaks + 1,
            currentStreak: 0, // Сброс текущего прогресса
          },
        });
        return 'Поздравляем! Вы завершили цикл из 30 дней и получили бонус!';
      }

      return `Отлично! Это ваш ${userProgress.currentStreak}-й день подряд.`;
    } else if (diffInDays > 1) {
      // Пользователь пропустил день
      userProgress = await this.prisma.userProgress.update({
        where: { telegramId },
        data: {
          currentStreak: 1, // Сброс прогресса
          lastInteraction: today,
        },
      });
      return 'Вы пропустили день! Прогресс сброшен. Начинаем заново с дня 1.';
    }

    // Если пользователь уже взаимодействовал сегодня
    return 'Вы уже отметились сегодня! Приходите завтра.';

  }
}
