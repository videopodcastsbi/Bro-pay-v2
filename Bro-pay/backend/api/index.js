const { NestFactory } = require('@nestjs/core');
const { ExpressAdapter } = require('@nestjs/platform-express');
const { ValidationPipe } = require('@nestjs/common');
const express = require('express');

let cachedHandler;

module.exports = async (req, res) => {
  if (!cachedHandler) {
    const { AppModule } = require('../dist/app.module');

    const server = express();
    const adapter = new ExpressAdapter(server);

    const app = await NestFactory.create(AppModule, adapter);

    app.enableCors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    app.setGlobalPrefix('api');

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    await app.init();

    cachedHandler = server;
  }

  cachedHandler(req, res);
};
