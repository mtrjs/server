import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: new Logger() });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      max: 600,
    }),
  );
  await app.listen(3001);
}
bootstrap();
