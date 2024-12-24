import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @UseGuards(AuthGuard)
  @Get('active-day')
  async getActiveDay(@Req() req: Request) {
    const telegramId = req.user.telegramId;
    console.log('telegramId', telegramId)
    // const activeDay = await this.bonusCalendarService.getActiveDay(userId);
    return { telegramId };
  }

  @UseGuards(AuthGuard)
  @Post('daily-interaction')
  async dailyInteraction(@Body() updateProgressDto: UpdateProgressDto, @Req() req: Request) {

    const telegramId = req.user.telegramId;

    if (!telegramId) {
      throw new BadRequestException('Invalid token');
    }

    // Убедитесь, что обновляемый объект DTO содержит telegramId
    updateProgressDto.telegramId = telegramId;
    
    return this.progressService.handleDailyInteraction(updateProgressDto);

  }
}
