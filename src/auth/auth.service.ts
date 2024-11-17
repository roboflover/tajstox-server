import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { validate, parse, InitData } from '@telegram-apps/init-data-node';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  validateInitData(authData: string): InitData {
    //const token = '8193856623:AAHvmJCbFTkaxVSxJ4ooq0Q-LmQLvH3Va3Q';
    const token = '7616166878:AAHKr7IvCJz7hSPZTi3lj9vYQ5j7JAiWTOw' //cosmotap

    this.logger.debug(`Received authData: ${authData}`);

    try {
      this.logger.debug('Validating authData...');
      validate(authData, token, { expiresIn: 300 });
      this.logger.debug('authData validated successfully.');

      const parsedData = parse(authData);
      this.logger.debug(`Parsed data: ${JSON.stringify(parsedData)}`);
      return parsedData;
    } catch (error) {
      this.logger.error('Failed to validate parse authData', { error, authData });
      throw new UnauthorizedException('Invalid authorization data');
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
