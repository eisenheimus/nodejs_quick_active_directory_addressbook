import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new ConfigService();
  const PORT = config.get("APP_PORT");
  const logger = new Logger();

  await app.listen(process.env.PORT ?? 3000).then(() => {
    logger.verbose(`*** Server started on ${PORT} port ***`)
  })

}
bootstrap();
