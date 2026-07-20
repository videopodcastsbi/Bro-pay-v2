const { NestFactory } = require('@nestjs/core');
const { ExpressAdapter } = require('@nestjs/platform-express');
const { ValidationPipe } = require('@nestjs/common');

let cachedApp;

module.exports = async (req, res) => {
  if (!cachedApp) {
    const express = require('express');
    const { AppModule } = require('../dist/app.module');

    const app = await NestFactory.create(AppModule, new ExpressAdapter(express()));

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
    cachedApp = app.getHttpAdapter().getInstance();
  }

  cachedApp(req, res);
};
