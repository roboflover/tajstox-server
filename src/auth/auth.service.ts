// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { validate, parse, InitData } from '@telegram-apps/init-data-node';

@Injectable()
export class AuthService {
  private readonly token = '8193856623:AAHvmJCbFTkaxVSxJ4ooq0Q-LmQLvH3Va3Q';

  validateInitData(authData: string): InitData {
    try {
      validate(authData, this.token, { expiresIn: 3600 });
      return parse(authData);
    } catch (error) {
      throw new UnauthorizedException('Invalid authorization data');
    }
  }
}
