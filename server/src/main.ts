import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MyLogger } from './logger/logger.service';
import { LoggingInterceptor } from './logging.interceptor';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as requestIp from 'request-ip';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.use(requestIp.mw());
  app.enableCors({
    origin: 'https://cluster.42seoul.io',
    credentials: true,
  });
  app.useGlobalInterceptors(
    new LoggingInterceptor(new MyLogger(new ConfigService())),
  );
  const config = new DocumentBuilder()
    .setTitle('42CheckIn')
    .setDescription('42CheckIn Open API Swagger')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useLogger(new MyLogger(new ConfigService()));
  await app.listen(3000);
}
bootstrap();
