// src/users/users.controller.ts
import { Controller, Patch, Body, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateScoreDto } from './dto/update-score.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('upscore')
  async updateScore(@Body() updateScoreDto: UpdateScoreDto) {
    const user = await this.usersService.updateScore(updateScoreDto);
    return { success: true, data: user };
  }

  @Get('score')
  async getScore(@Body() telegramId: string) {
    const score = await this.usersService.getScore(telegramId);
    return { data: score };
  }

}