import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Validations for class-validator
  app.useGlobalPipes(new ValidationPipe());
  // Cors
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
