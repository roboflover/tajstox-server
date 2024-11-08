// cosmotapbot 7616166878:AAHKr7IvCJz7hSPZTi3lj9vYQ5j7JAiWTOw
// tajstox 8193856623:AAHvmJCbFTkaxVSxJ4ooq0Q-LmQLvH3Va3Q

import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';

@Injectable()
export class BotService {
  private bot: Telegraf;
  
  constructor() {
    this.bot = new Telegraf('8193856623:AAHvmJCbFTkaxVSxJ4ooq0Q-LmQLvH3Va3Q'); // Замените на ваш токен
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
            [{ text: 'Играть в один клик', url: 'https://t.me/Tajstoxbot/tajstox' }], // Изменено на 'url'
            [{ text: 'Подписаться на канал', callback_data: 'button2' }],
            [{ text: 'Как заработать на игре', callback_data: 'button3' }],
          ],
        },
      },
    );
  }
}






