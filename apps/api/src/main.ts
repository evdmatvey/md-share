import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';

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

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}

void bootstrap();
