import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { AppModule } from './app.module';
// import { CatchAllExceptionFilter } from './common/http-error.filter';
import { env } from './config/env';
import { AllExceptionsFilter } from './interceptors/exceptionFilter';
import { PageTransferResponseInterceptor } from './interceptors/response.interceptor';

config();
const PORT = env.PORT;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalFilters(new CatchAllExceptionFilter());
  app.setGlobalPrefix('api');
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
  console.log(`|--------Server is running on port ${PORT}--------|`);
});
