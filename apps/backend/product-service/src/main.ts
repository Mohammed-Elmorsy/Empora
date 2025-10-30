import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ProductServiceModule } from './product-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ProductServiceModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3003;
  await app.listen(port);

  console.log(`📦 Product Service is running on: http://localhost:${port}`);
}

bootstrap();
