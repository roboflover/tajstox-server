import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { AuthGuard } from '../auth/auth.guard'; 
import { Request } from 'express';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @UseGuards(AuthGuard)
  @Get('active-day')
  async getActiveDay(@Req() req: Request) {
    const telegramId = req.user.telegramId;
    console.log('progress.controller.ts telegramId', telegramId)
    const activeDay = await this.progressService.getActiveDay(telegramId);
    return { telegramId };
  }

  @UseGuards(AuthGuard)
  @Post('update-day')
  async updateDay(
    @Body('day') day: number,
    @Body('bonus') bonus: number,
    @Req() req: Request
  ) {
    const telegramId = req.user.telegramId;
    console.log('progress.controller.ts', telegramId)
    const nextDay = await this.progressService.updateDay(
      telegramId,
      day,
      bonus,
    );
    return 'nextDay' ;
  }
}
