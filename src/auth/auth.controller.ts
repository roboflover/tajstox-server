// auth.controller.ts

import { Controller, Post, UnauthorizedException, Headers, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('authenticate')
  authenticateUser(@Headers('authorization') authorization: string): string {
    const [authType, initData] = (authorization || '').split(' ');
    // console.log('initData', initData)
    if (authType !== 'tma' || !initData) {
      console.log('Неверная схема авторизации')
      throw new UnauthorizedException('Неверная схема авторизации');
    }

    try {
      console.log('вызываю метод validateInitData')
      // Используем existing метод validateInitData для валидации
      const validData = this.authService.validateInitData(initData);
      // Например, можем вернуть часть валидных данных
      return `Authentication successful: ${JSON.stringify(validData)}`;
    } catch (error) {
      throw new UnauthorizedException('Ошибка аутентификации пользователя');
    }
  }

}