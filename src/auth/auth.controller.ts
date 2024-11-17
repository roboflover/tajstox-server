// auth.controller.ts

import { Controller, Post, UnauthorizedException, Headers, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PublicRoute } from "../decorators/public-route.decorator"

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

    @PublicRoute()
    @Post("authenticate")
    async login(@Body() body: { initData: string }) {
        return await this.authService.validateInitData(body.initData)
    }

  // @Post('authenticate')
  // authenticateUser(@Headers('authorization') authorization: string): string {
  //   const [authType, initData] = (authorization || '').split(' ');
  //   // console.log('initData', initData)
  //   if (authType !== 'tma' || !initData) {
  //     console.log('Неверная схема авторизации')
  //     throw new UnauthorizedException('Неверная схема авторизации');
  //   }

  //   try {
  //     console.log('вызываю метод validateInitData')
  //     // Используем existing метод validateInitData для валидации
  //     const validData = this.authService.validateInitData(initData);
  //     // Например, можем вернуть часть валидных данных
  //     return `Authentication successful: ${JSON.stringify(validData)}`;
  //   } catch (error) {
  //     throw new UnauthorizedException('Ошибка аутентификации пользователя');
  //   }
  // }

}