// auth.controller.ts

import { Controller, Post, UnauthorizedException, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('authenticate')
  authenticateUser(@Headers('authorization') authorization: string): string {
    const [authType, initData] = (authorization || '').split(' ');

    if (authType !== 'tma' || !initData) {
      throw new UnauthorizedException('Неверная схема авторизации');
    }

    try {
      // Используем existing метод validateInitData для валидации
      const validData = this.authService.validateInitData(initData);
      // Например, можем вернуть часть валидных данных
      return `Authentication successful: ${JSON.stringify(validData)}`;
    } catch (error) {
      throw new UnauthorizedException('Ошибка аутентификации пользователя');
    }
  }
}