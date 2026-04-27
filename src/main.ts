import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { config } from 'dotenv';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
// import { CatchAllExceptionFilter } from './common/http-error.filter';
import { env } from './config/env';
import { winstonConfig } from './config/logger.config';
import { AllExceptionsFilter } from './interceptors/exceptionFilter';
import { PageTransferResponseInterceptor } from './interceptors/response.interceptor';

config();
const PORT = env.PORT;
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });
  // app.useGlobalFilters(new CatchAllExceptionFilter());
  app.setGlobalPrefix('api');
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  });

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, //makes @Query, @Param, @Body will validate and transform automatically
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new PageTransferResponseInterceptor());

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

  await app.listen(PORT ?? 9095);
}
void bootstrap().then((): void => {
  Logger.log(
    `|--------Server is running on port ${PORT}--------|`,
    'Bootstrap',
  );
});
