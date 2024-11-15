import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {

  verifyTelegramData(initData: string): boolean {
    console.log('Verifying Telegram data...');
    
    // Раскодируем полученные данные
    const encoded = decodeURIComponent(initData);
    console.log('Decoded initData:', encoded);

    // Создаем секретный ключ на основе токена бота
    const secretKey = crypto.createHash('sha256').update(process.env.BOT_TOKEN).digest();
    console.log('Secret key:', secretKey.toString('hex'));
    
    // Парсим строку и получаем массив пар "ключ=значение"
    const arr = encoded.split('&');
    console.log('Parsed array:', arr);

    // Находим индекс хеша в массиве
    const hashIndex = arr.findIndex(str => str.startsWith('hash='));
    if (hashIndex === -1) {
      console.error('Hash not found in initData');
      return false;
    }
    const hash = arr.splice(hashIndex, 1)[0].split('=')[1];
    console.log('Received hash:', hash);

    // Сортировка по алфавиту остальных данных
    arr.sort((a, b) => a.localeCompare(b));
    console.log('Sorted data:', arr);

    // Создаем строку для контрольной проверки
    const dataCheckString = arr.join('\n');
    console.log('Data-check string:', dataCheckString);

    // Вычисляем хеш от dataCheckString с использованием секретного ключа
    const _hash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
    console.log('Computed hash:', _hash);

    // Сравниваем ожидаемый и полученный хеши
    const result = _hash === hash;
    console.log('Verification result:', result);

    return result;
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

