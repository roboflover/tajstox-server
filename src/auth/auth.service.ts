import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly botToken:string; // Ваш токен бота

  constructor() {
    if (!process.env.BOT_TOKEN) {
      throw new Error('BOT_TOKEN is not defined in the environment');
    }
    this.botToken = process.env.BOT_TOKEN;
    console.log('this.botToken', this.botToken)
  }
  verifyTelegramData(initData: string): boolean {
    console.log('Verifying Telegram data...');
    const secretKey = crypto.createHash('sha256').update(this.botToken).digest();
    const parsedData = new URLSearchParams(initData);
    const hash = parsedData.get('hash');
    const dataCheckString = [...parsedData.entries()]
      .filter(([key]) => key !== 'hash')
      .map(([key, value]) => `${key}=${value}`)
      .sort()
      .join('n');

    const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
    console.log(`Expected hash: ${hmac}, Received hash: ${hash}`);
    return hmac === hash;
  }

  getUserId(initData: string): number {
    console.log('Extracting user ID...');
    const parsedData = new URLSearchParams(initData);
    const userId = parseInt(parsedData.get('id'), 10);
    console.log(`Extracted user ID: ${userId}`);
    return userId;
  }

  createEncryptedString(userId: number): string {
    console.log(`Creating encrypted string for user ID: ${userId}...`);
    const payload = { userId };
    const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });
    console.log(`Generated JWT token: ${token}`);
    return token;
  }

  authenticateUser(initData: string) {
    console.log('Starting user authentication...');
    if (!this.verifyTelegramData(initData)) {
      console.error('Invalid Telegram data');
      throw new Error('Invalid Telegram data');
    }

    const userId = this.getUserId(initData);
    // Здесь вы можете выполнить поиск пользователя в базе данных
    // или создать новую запись, если пользователь не найден

    const encryptedString = this.createEncryptedString(userId);
    console.log('User authenticated successfully.');
    return encryptedString;
  }
}
