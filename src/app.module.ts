import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotModule } from './bot/bot.module';
import { BotService } from './bot/bot.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config'


@Module({
  imports: [BotModule, AuthModule, UserModule, 
    ConfigModule.forRoot({
      // Опционально: можете добавить конфигурацию для загрузки переменных окружения
      isGlobal: true, // делает ConfigService доступным глобально
    }),
    // Другие модули...
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
