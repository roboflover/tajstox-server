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

  async login(authData: string): Promise<{ parsedData: InitData, token: string }> {
    this.logger.log('Starting login process');
    const token = this.configService.get<string>('BOT_TOKEN');
    // console.log(`referralLink`, referralLink)
    try {
      this.logger.debug('Validating auth data');
      validate(authData, token, { expiresIn: 300 });
      const parsedData = parse(authData);
      // this.logger.debug(`Parsed data: ${JSON.stringify(parsedData)}`);

      // Создаем/находим пользователя
      const user = await this.findOrCreateUser(parsedData, authData);

      // Генерация JWT токена
      const jwtToken = await this.jwtService.signAsync({ telegramId: user.telegramId });
      // this.logger.log(`Login successful for user: ${user.telegramId}`);

      return {
        parsedData,
        token: jwtToken,
      };
    } catch (error) {
      // this.logger.error('Login failed: Invalid authorization data', error.stack);
      throw new UnauthorizedException('Invalid authorization data');
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
  async findOrCreateUser(parsedData, authData: string) {
    let user = await this.prisma.user.findUnique({
      where: { telegramId: parsedData.user.id.toString() },
    });
  
    const defaultUsername = 'default_username'; // Установите любое значение по умолчанию
  
    if (user) {
      user = await this.prisma.user.update({
        where: { telegramId: parsedData.user.id.toString() },
        data: {
          username: parsedData.user.username ?? defaultUsername,
          firstName: parsedData.user.firstName,
          authDate: parsedData.authDate,
          authPayload: authData,
        },
      });
    } else {
      this.logger.log('User not found, creating a new user');
      user = await this.prisma.user.create({
        data: {
          telegramId: parsedData.user.id.toString(),
          authDate: parsedData.authDate,
          authPayload: authData,
          firstName: parsedData.user.firstName,
          score: 0,
          username: parsedData.user.username ?? defaultUsername,
        },
      });
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