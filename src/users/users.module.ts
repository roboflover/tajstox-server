// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from 'src/auth/constants';

@Module({
  imports: [
    // Подключаем PassportModule для работы с стратегиями аутентификации
    PassportModule,

    // Подключаем JwtModule, который предоставляет сервисы для работы с JWT
    JwtModule.register({
      secret: jwtConstants.secret,  // Устанавливаем секретный ключ для подписи токенов
      signOptions: { expiresIn: '60s' },  // Опциональные параметры: срок действия токена
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})

export class UsersModule {}