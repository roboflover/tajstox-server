import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const frontendUrl = configService.get('FRONTEND_URL');

  app.setGlobalPrefix('server');
  const port = configService.get('PORT');
  if (frontendUrl) {
    app.enableCors({
      origin: frontendUrl,
      credentials: true,
    });
  }
  app.enableCors();
  await app.listen(port); 
  console.log('port', port)

}
bootstrap();

