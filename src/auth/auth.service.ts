import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { createHmac } from "node:crypto";

@Injectable()
export class AuthService {

  verifyInitData = (telegramInitData: string): boolean => {
    const urlParams = new URLSearchParams(telegramInitData);

    const hash = urlParams.get('hash');
    urlParams.delete('hash');
    urlParams.sort();

    let dataCheckString = '';
    for (const [key, value] of urlParams.entries()) {
        dataCheckString += `${key}=${value}\n`;
    }
    dataCheckString = dataCheckString.slice(0, -1);

    const secret = crypto.createHmac('sha256', 'WebAppData').update(process.env.BOT_TOKEN ?? '');
    const calculatedHash = crypto.createHmac('sha256', secret.digest()).update(dataCheckString).digest('hex');
    console.log(calculatedHash)
    return calculatedHash === hash;
}

  parseInitData(initData: string) {
    const q = new URLSearchParams(initData);
    const hash = q.get("hash");
    q.delete("hash");
    const v = Array.from(q.entries());
    v.sort(([aN], [bN]) => aN.localeCompare(bN));
    const data_check_string = v.map(([n, v]) => `${n}=${v}`).join("\n");
    return { hash, data_check_string };
  }
  
  checkSignature(initData: string) {
    const bot_token = process.env.BOT_TOKEN
    const { hash, data_check_string } = this.parseInitData(initData);
  
    const secret_key = createHmac("sha256", "WebAppData").update(bot_token).digest();
    const key = createHmac("sha256", secret_key)
      .update(data_check_string)
      .digest("hex");
    console.log('key', key)
    console.log('hash', hash)
    return key === hash;
  }

  verifyTelegramData(initData: string): boolean {
    console.log('Verifying Telegram data...');

    // The data is a query string, which is composed of a series of field-value pairs.
    const encoded = decodeURIComponent(initData); 
    

    // HMAC-SHA-256 signature of the bot's token with the constant string WebAppData used as a key.
    const secret = crypto
      .createHmac('sha256', 'WebAppData')
      .update(process.env.BOT_TOKEN);

    // Data-check-string is a chain of all received fields'.
    const arr = encoded.split('&');
    const hashIndex = arr.findIndex(str => str.startsWith('hash='));
    const hash = arr.splice(hashIndex)[0].split('=')[1];
    // sorted alphabetically
    arr.sort((a, b) => a.localeCompare(b));
    // in the format key=<value> with a line feed character ('\n', 0x0A) used as separator
    // e.g., 'auth_date=<auth_date>\nquery_id=<query_id>\nuser=<user>
    const dataCheckString = arr.join('\n');
    
    // The hexadecimal representation of the HMAC-SHA-256 signature of the data-check-string with the secret key
    const _hash = crypto
      .createHmac('sha256', secret.digest())
      .update(dataCheckString)
      .digest('hex');
    
    // if hash are equal the data may be used on your server.
    // Complex data types are represented as JSON-serialized objects.
    return _hash === hash;
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
    if (!this.verifyInitData(initData)) {
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
