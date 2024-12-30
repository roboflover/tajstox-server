import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BotService {
  private bot: Telegraf;
  
  constructor(private configService: ConfigService) {
    const botToken = this.configService.get<string>('BOT_TOKEN');
    this.bot = new Telegraf(botToken); 
    
    // Обработчик команды /start
    this.bot.start((ctx) => this.handleStartCommand(ctx));
    
    // Запуск бота
    this.bot.launch();
  }

  // Метод для обработки команды /start
  private handleStartCommand(ctx) {
    const startPayload = ctx.startPayload; // ctx.startPayload содержит значение, переданное через ?startapp=...

    if (startPayload) {
      console.log(`Реферальный код: ${startPayload}`);
      
      // Открытие бота с реферальным кодом
      ctx.reply(
        `Добро пожаловать! Вы перешли по реферальной ссылке с кодом: ${startPayload}`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: 'Открыть TapSwap',
                  url: `https://t.me/Tajstoxbot?startapp=${startPayload}`, // Ссылка на открытие бота с реферальным кодом
                },
              ],
            ],
          },
        },
      );

      // Логика обработки реферального кода
      this.processReferralCode(ctx.from.id, startPayload);
    } else {
      console.log('Пользователь запустил бота без параметров.');
      this.sendWelcomeMessage(ctx);
    }
  }

  // Логика обработки реферального кода
  private processReferralCode(userId: number, referralCode: string) {
    // Здесь можно добавить логику для обработки реферального кода.
    // Например:
    // 1. Проверить, существует ли такой реферальный код в базе данных.
    // 2. Связать пользователя (userId) с этим реферальным кодом.
    // 3. Начислить бонус пользователю, который поделился ссылкой.
    // 4. Отправить уведомление пользователю, который пригласил нового участника.

    console.log(`Обработка реферального кода: UserID=${userId}, ReferralCode=${referralCode}`);

    // Пример: сохраняем данные в базе (замените на вашу реализацию)
    // this.databaseService.saveReferral(userId, referralCode);
  }

  // Метод для отправки приветственного сообщения
  private sendWelcomeMessage(ctx) {
    ctx.replyWithPhoto(
      { url: 'https://ioflood.com/blog/wp-content/uploads/2023/10/java_logo_dice_random-300x300.jpg' }, // Замените на URL вашей картинки
      {
        caption: 
`Welcome to TapSwap!
Tap on the coin and see your balance rise.

TapSwap is a cutting-edge financial platform where users can earn tokens by leveraging the mining app's various features. The majority of TapSwap Token (TAPS) distribution will occur among the players here.

Do you have friends, relatives, or co-workers?
Bring them all into the game.
More buddies, more coins.`,
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Играть в один клик', url: 't.me/Tajstoxbot/tajstox' }], // Изменено на 'url'
            [{ text: 'Подписаться на канал', callback_data: 'button2' }],
            [{ text: 'Как заработать на игре', callback_data: 'button3' }],
          ],
        },
      },
    );
  }
}
