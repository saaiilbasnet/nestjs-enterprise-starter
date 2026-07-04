import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import { env } from './config/env';
import { winstonConfig } from './config/logger.config';
import { AllExceptionsFilter } from './interceptors/exceptionFilter';
import { PageTransferResponseInterceptor } from './interceptors/response.interceptor';

const PORT = env.PORT;
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  app.setGlobalPrefix('api');
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: env.CORS_ORIGINS,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    maxAge: 86400,
  });

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      disableErrorMessages: env.NODE_ENV === 'production',
    }),
  );

  app.useGlobalInterceptors(new PageTransferResponseInterceptor());

  if (env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Swagger API')
      .setDescription('API Documentation Swagger')
      .setExternalDoc('Postman Collection', '/docs-json')
      .setVersion('beta')
      .addCookieAuth('_rt_')
      .build();
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  app.enableShutdownHooks();

  await app.listen(PORT ?? 9095);
}
void bootstrap().then((): void => {
  Logger.log(
    `|--------Server is running on port ${PORT}--------|`,
    'Bootstrap',
  );
});
