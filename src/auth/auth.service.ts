import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { validate, parse, InitData } from '@telegram-apps/init-data-node';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(authData: string, referralLink?: string): Promise<{ parsedData: InitData, token: string }> {
    const token = this.configService.get<string>('BOT_TOKEN');

    try {
      validate(authData, token, { expiresIn: 300 });
      const parsedData = parse(authData);

      // Создаем/находим пользователя
      const user = await this.findOrCreateUser(parsedData, authData, referralLink);

      // Генерация JWT токена
      const jwtToken = await this.jwtService.signAsync({ telegramId: user.telegramId });

      return {
        parsedData,
        token: jwtToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid authorization data');
    }
  }

  getHello(): string {
    return 'Hello World!';
  }

  async findOrCreateUser(parsedData, authData: string, referralLink?: string) {
    let user = await this.prisma.user.findUnique({
      where: { telegramId: parsedData.user.id.toString() },
    });

    if (user) {
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
      let referrer;
      if (referralLink) {
        // Логика извлечения ID реферера из ссылки
        referrer = await this.prisma.user.findUnique({
          where: { telegramId: referralLink },
        });
      }

      user = await this.prisma.user.create({
        data: {
          telegramId: parsedData.user.id.toString(),
          username: parsedData.user.username,
          authDate: parsedData.authDate,
          authPayload: authData,
          firstName: parsedData.user.firstName,
          score: 0,
          referredBy: referrer ? {
            create: {
              referrer: { connect: { id: referrer.id } }, // Связываем реферера
            },
          } : undefined
        },
      });
    }

    return user;
  }

  async updateReferralEarnedScore(referrerId: number, earnedScore: number) {
    const bonusScore = earnedScore * 0.15;

    await this.prisma.user.update({
      where: { id: referrerId },
      data: {
        score: {
          increment: bonusScore,
        },
      },
    });
  }
}