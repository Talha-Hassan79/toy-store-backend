import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  const allowedOrigins = configService.get<string>('ALLOWED_ORIGINS');

  app.enableCors({
    origin: allowedOrigins ? allowedOrigins.split(',') : true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  const port = process.env.PORT || configService.get<number>('PORT') || 3000;

  await app.listen(port, '0.0.0.0');

  console.log(`Application running on: http://localhost:${port}`);
}
bootstrap();
