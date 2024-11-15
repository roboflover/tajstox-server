import { Controller, Get, Query, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('authenticate')
  authenticateUser(@Query('initData') initData: string): string {
    try {
      console.log(initData)
      return this.authService.authenticateUser(initData);
    } catch (error) {
      throw new UnauthorizedException('Failed to authenticate user');
    }
  }
}
