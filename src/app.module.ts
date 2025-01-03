import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotModule } from './bot/bot.module';
import AuthModule from './auth/auth.module';
import { ConfigModule } from '@nestjs/config'
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProgressModule } from './progress/progress.module';

@Module({
  imports: [BotModule, AuthModule, UsersModule,
    ConfigModule.forRoot({
      // Опционально: можете добавить конфигурацию для загрузки переменных окружения
      isGlobal: true, // делает ConfigService доступным глобально
    }), UsersModule, PrismaModule, ProgressModule,
    // Другие модули...
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
