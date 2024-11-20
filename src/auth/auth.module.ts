// auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthGuard } from './auth.guard';
import { jwtConstants } from './constants';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    // Подключаем PassportModule для работы с стратегиями аутентификации
    PassportModule,

    // Подключаем JwtModule, который предоставляет сервисы для работы с JWT
    JwtModule.register({
      secret: jwtConstants.secret,  // Устанавливаем секретный ключ для подписи токенов
      signOptions: { expiresIn: '600s' },  // Опциональные параметры: срок действия токена
    }),
  ],
  providers: [
    AuthGuard,  // Регистрируем защитник как провайдер
    Reflector,  // Необходим для работы с метаданными маршрутов
    AuthService,
    PrismaService,
  ],
  exports: [
    AuthGuard,  // Экспортируем защитник, чтобы он был доступен в других модулях
  ],
  controllers: [AuthController],

})

export default class AuthModule {}

