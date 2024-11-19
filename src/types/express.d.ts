import { Request } from 'express';

declare module 'express' {
  interface Request {
    user?: {
      id: number; // или string, в зависимости от того, какой тип данных вы используете для ID
      telegramId?: string;
      // Добавьте другие свойства, которые вы ожидаете в `req.user`
    };
  }
}