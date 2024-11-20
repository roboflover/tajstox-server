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
  async updateScore(@Body() updateScoreDto: UpdateScoreDto, @Req() req: Request) {
    const telegramId = req.user.telegramId;

    if (!telegramId) {
      throw new BadRequestException('Invalid token');
    }

    // Убедитесь, что обновляемый объект DTO содержит telegramId
    updateScoreDto.telegramId = telegramId;
    
    const user = await this.usersService.updateScore(updateScoreDto);
    return { success: true, data: user };
  }

  @UseGuards(AuthGuard)
  @Get('score')
  async getScore(@Req() req: Request) {

    const userId = req.user.telegramId; 
    
    if (!userId) {
      throw new BadRequestException('Invalid token');
    }

    const score = await this.usersService.getScoreByUserId(userId);
    // console.log('score', score)
    return { data: score };
  }
}