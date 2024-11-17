// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { validate, parse, InitData } from '@telegram-apps/init-data-node';

@Injectable()
export class AuthService {
  private readonly token = '8193856623:AAHvmJCbFTkaxVSxJ4ooq0Q-LmQLvH3Va3Q';
  validateInitData(authData: string): InitData {
    const initTest = "user=%7B%22id%22%3A7236622499%2C%22first_name%22%3A%22%D0%A1%D1%82%D0%B5%D0%BF%D0%B0%D0%BD%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22StepanGrigorian%22%2C%22language_code%22%3A%22en%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FqEIFW3a1VHc6BfkQpyUOIzJxxSnqwL2rhiLlr2bA5UYocx8rTO5yesUB3MGqJyYE.svg%22%7D&chat_instance=7874164484058592972&chat_type=private&auth_date=1731849553&signature=3DdGopsi2sBBRR2haUHmqKGBJ9YxFxsssCRUAoWEfxyhdU9lTI6NdO0bFGoDYPPdNEwt9JYxl5Fg427CqcDwCQ&hash=af3f53a3de1d0b123a615e21449d9fd523bcd6ec5657ee4214b94b9e66794b85"
    try {
      console.log('authData', authData)
      validate(authData, this.token, { expiresIn: 3600 });
      return parse(authData);
    } catch (error) {
      throw new UnauthorizedException('Invalid authorization data');
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
