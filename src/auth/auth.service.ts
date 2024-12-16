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
    this.logger.log('Starting login process');
    const token = this.configService.get<string>('BOT_TOKEN');

    try {
      this.logger.debug('Validating auth data');
      validate(authData, token, { expiresIn: 300 });
      const parsedData = parse(authData);
      this.logger.debug(`Parsed data: ${JSON.stringify(parsedData)}`);

      // Создаем/находим пользователя
      const user = await this.findOrCreateUser(parsedData, authData, referralLink);

      // Генерация JWT токена
      const jwtToken = await this.jwtService.signAsync({ telegramId: user.telegramId });
      this.logger.log(`Login successful for user: ${user.telegramId}`);

      return {
        parsedData,
        token: jwtToken,
      };
    } catch (error) {
      this.logger.error('Login failed: Invalid authorization data', error.stack);
      throw new UnauthorizedException('Invalid authorization data');
    }
  }

  getHello(): string {
    this.logger.log('Responding with Hello World');
    return 'Hello World!';
  }

  async findOrCreateUser(parsedData, authData: string, referralLink?: string) {
    this.logger.log(`Finding or creating user with telegram ID: ${parsedData.user.id}`);

    let user = await this.prisma.user.findUnique({
      where: { telegramId: parsedData.user.id.toString() },
    });

    if (user) {
      this.logger.log(`User found: ${user.telegramId}, updating user data`);
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
      this.logger.log('User not found, creating a new user');
      let referrer;
      if (referralLink) {
        this.logger.debug(`Finding referrer with telegram ID: ${referralLink}`);
        referrer = await this.prisma.user.findUnique({
          where: { telegramId: referralLink },
        });
        if (referrer) {
          this.logger.log(`Referrer found: ${referrer.telegramId}`);
        } else {
          this.logger.warn('Referrer not found');
        }
      }
      console.log(parsedData.user)
      user = await this.prisma.user.create({
        data: {
          telegramId: parsedData.user.id.toString(),
          username: parsedData.user.username.toString(),
          authDate: parsedData.authDate,
          authPayload: authData,
          firstName: parsedData.user.firstName,
          score: 0,
          referredBy: referrer ? {
            create: {
              referrer: { connect: { id: referrer.id } }, // Связываем реферера
            },
          } : undefined,
        },
      });
      this.logger.log(`New user created: ${user.telegramId}`);
    }

    return user;
  }

  async updateReferralEarnedScore(referrerId: number, earnedScore: number) {
    const bonusScore = earnedScore * 0.15;
    this.logger.log(`Updating referral earned score for referrer ID: ${referrerId}, bonus score: ${bonusScore}`);

    await this.prisma.user.update({
      where: { id: referrerId },
      data: {
        score: {
          increment: bonusScore,
        },
      },
    });
    this.logger.log(`Score updated successfully for referrer ID: ${referrerId}`);
  }
}