// src/users/users.controller.ts
import { Controller, Patch, Body, Get, BadRequestException, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateScoreDto } from './dto/update-score.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('upscore')
  async updateScore(@Body() updateScoreDto: UpdateScoreDto) {
    console.log(updateScoreDto)
    const user = await this.usersService.updateScore(updateScoreDto);
    return { success: true, data: user };
  }

  @Get('score')
  async getScore(@Query('telegramId') telegramId: string) {
    if (!telegramId) {
      throw new BadRequestException('telegramId is required');
    }

    const score = await this.usersService.getScore(telegramId);
    return { data: score };
  }
  

}