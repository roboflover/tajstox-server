// src/auth/auth.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { validate, parse } from '@telegram-apps/init-data-node';

const token = '8193856623:AAHvmJCbFTkaxVSxJ4ooq0Q-LmQLvH3Va3Q';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const [authType, authData = ''] = (req.header('authorization') || '').split(' ');

    try {
      switch (authType) {
        case 'tma':
          validate(authData, token, { expiresIn: 3600 });
          res.locals.initData = parse(authData);
          return next();
        default:
          throw new UnauthorizedException('Unauthorized');
      }
    } catch (e) {
      return next(new UnauthorizedException(e.message));
    }
  }
}