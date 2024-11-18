// src/users/users.controller.ts
import { Controller, Patch, Body } from '@nestjs/common';
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
}