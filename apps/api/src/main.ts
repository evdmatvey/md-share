import { HttpStatus, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CommonErrorCode } from '@md-share/contracts';
import type { NextFunction, Request, Response } from 'express';
import { AppModule } from '@/app.module';
import { CommonMessages } from '@/common/messages';
import { setupSwagger } from '@/common/openapi';

function notFoundHandler(
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (res.headersSent) {
    next();
    return;
  }

  res.status(HttpStatus.NOT_FOUND).json({
    statusCode: HttpStatus.NOT_FOUND,
    error: CommonErrorCode.NOT_FOUND,
    message: CommonMessages.NOT_FOUND,
  });
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.enableCors({
    origin: [process.env.CORS_ORIGIN ?? 'http://localhost:5173'],
  });
  app.enableShutdownHooks();

  await app.init();
  setupSwagger(app);
  app.use(notFoundHandler);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}

void bootstrap();
