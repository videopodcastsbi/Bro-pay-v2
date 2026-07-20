import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor, Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // CORS — allow Flutter (and any client) to access the API
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global API prefix
  app.setGlobalPrefix('api');

  // Global validation pipe — validate DTOs, strip unknown fields
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // strip unknown fields
      forbidNonWhitelisted: true, // throw error for unknown fields
      transform: true,           // auto-transform types (e.g. string to number)
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global serializer — handle @Exclude() decorators if added later
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`🚀 Bro-Pay API is running on: http://127.0.0.1:${port}/api`);
  logger.log(`📖 Environment: ${process.env.NODE_ENV ?? 'development'}`);
}

bootstrap();
