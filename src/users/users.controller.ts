// src/users/users.controller.ts
import { Controller, Patch, Body, Get, BadRequestException, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateScoreDto } from './dto/update-score.dto';
import { AuthGuard } from '../auth/auth.guard'; // Подразумевается, что у вас настроен механизм JWT-аутентификации
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Patch('setScore')
  async updateScore(@Body() updateScoreDto: UpdateScoreDto) {
    const user = await this.usersService.updateScore(updateScoreDto);
    return { success: true, data: user };
  }

  @UseGuards(AuthGuard)
  @Get('score')
  async getScore(@Req() req: Request) {
    console.log('req.user.telegramId', req.user.telegramId)
    // Предполагаем, что JwtStrategy добавляет userId в req.user
    // const userId = req.user.id; // или другой идентификатор пользователя внутри JWT

    // if (!userId) {
    //   throw new BadRequestException('Invalid token');
    // }

    // const score = await this.usersService.getScoreByUserId(userId);
    return { data: 111 };
  }
}