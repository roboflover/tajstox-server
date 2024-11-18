import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { validate, parse, InitData } from '@telegram-apps/init-data-node';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private сreateUserDto: CreateUserDto
  constructor(private prisma: PrismaService,
              
  ) {}

  login(authData: string): InitData {
    //const token = '8193856623:AAHvmJCbFTkaxVSxJ4ooq0Q-LmQLvH3Va3Q';
    const token = '7616166878:AAHKr7IvCJz7hSPZTi3lj9vYQ5j7JAiWTOw' //cosmotap

    this.logger.debug(`Received authData: ${authData}`);
    
    try {
      this.logger.debug('Validating authData...');
      validate(authData, token, { expiresIn: 300 });
      this.logger.debug('authData validated successfully.');

      const parsedData = parse(authData);
      this.logger.debug(`Parsed data: ${JSON.stringify(parsedData)}`);
      // console.log('parsedData', parsedData)

      const user = this.findOrCreateUser(this.сreateUserDto)
      console.log(user)
      return parsedData;
    } catch (error) {
      this.logger.error('Failed to validate parse authData', { error, authData });
      throw new UnauthorizedException('Invalid authorization data');
    }
  }

  getHello(): string {
    return 'Hello World!';
  }

  async findOrCreateUser(dto: CreateUserDto) {
    const user = await this.prisma.user.upsert({
      where: { telegramId: dto.telegramId },
      update: { username: dto.username },
      create: {
        telegramId: dto.telegramId,
        username: dto.username,
        authDate: dto.authDate,
        authPayload: dto.authPayload,
        firstName: dto.firstName,
        score: dto.score,
      },
    });

    return user;
  }
}
