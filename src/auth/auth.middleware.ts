// src/auth/auth.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const [authType, authData = ''] = (req.header('authorization') || '').split(' ');

    if (authType === 'tma') {
      try {
        const initData = this.authService.validateInitData(authData);
        res.locals.initData = initData;
        return next();
      } catch (error) {
        return next(error);
      }
    }

    return next(new UnauthorizedException('Unauthorized'));
  }
}
