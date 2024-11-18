import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotModule } from './bot/bot.module';
import { BotService } from './bot/bot.service';
import AuthModule from './auth/auth.module';
import { ConfigModule } from '@nestjs/config'
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';


@Module({
  imports: [BotModule, AuthModule, UsersModule,
    ConfigModule.forRoot({
      // Опционально: можете добавить конфигурацию для загрузки переменных окружения
      isGlobal: true, // делает ConfigService доступным глобально
    }), UsersModule, PrismaModule,
    // Другие модули...
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
