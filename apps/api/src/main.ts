import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: true,
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port);
  });
}

bootstrap();
