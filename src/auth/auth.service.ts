import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { validate, parse, InitData } from '@telegram-apps/init-data-node';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(authData: string): Promise<{ parsedData: InitData, token: string }> {
    const token = '7616166878:AAHKr7IvCJz7hSPZTi3lj9vYQ5j7JAiWTOw';

    try {
      validate(authData, token, { expiresIn: 300 });
      const parsedData = parse(authData);

      // Создаем/находим пользователя
      const user = await this.findOrCreateUser(parsedData, authData);

      // Генерация JWT токена
      const jwtToken = await this.jwtService.signAsync({ telegramId: user.telegramId });
      
      return {
        parsedData,
        token: jwtToken
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid authorization data');
    }
  }

  getHello(): string {
    return 'Hello World!';
  }

  async findOrCreateUser(parsedData, authData: string) {
    // Проверяем, существует ли пользователь
    let user = await this.prisma.user.findUnique({
      where: { telegramId: parsedData.user.id.toString() },
    });
    // console.log('user', user)
    if (user) {
      // Если пользователь существует, используем его существующий score
      user = await this.prisma.user.update({
        where: { telegramId: parsedData.user.id.toString() },
        data: {
          username: parsedData.user.username,
          firstName: parsedData.user.firstName,
          authDate: parsedData.authDate,
          authPayload: authData,
        },
      });
    } else {
      // Если пользователя нет, создаем нового с дефолтным score
      user = await this.prisma.user.create({
        data: {
          telegramId: parsedData.user.id.toString(),
          username: parsedData.user.username,
          authDate: parsedData.authDate,
          authPayload: authData,
          firstName: parsedData.user.firstName,
          score: 0,  // или другое дефолтное значение
        },
      });
    }

    return user;
  }
}
