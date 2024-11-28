import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BotService {
  private bot: Telegraf;
  
  constructor(private configService: ConfigService) {
    const botToken = this.configService.get<string>('BOT_TOKEN');
    this.bot = new Telegraf(botToken); 
    this.bot.start((ctx) => this.sendWelcomeMessage(ctx));
    this.bot.launch();
  }

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
            [{ text: 'Играть в один клик', url: 't.me/robofication_bot/test' }], // Изменено на 'url'
            [{ text: 'Подписаться на канал', callback_data: 'button2' }],
            [{ text: 'Как заработать на игре', callback_data: 'button3' }],
          ],
        },
      },
    );
  }
}






