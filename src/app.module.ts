import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthMiddleware } from './app/auth/auth.middleware';
import { AuthModule } from './app/auth/auth.module';
import { HealthModule } from './app/health/health.module';
import { MediaModule } from './app/media/media.module';
import { User } from './app/user/entities/user.entity';
import { UserModule } from './app/user/user.module';
import { typeOrmConfigs } from './config/db-config';
import { PageTransferResponseInterceptor } from './interceptors/response.interceptor';

@Module({
  imports: [
    // SentryModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(typeOrmConfigs()),
    TypeOrmModule.forFeature([User]),
    ServeStaticModule.forRoot({
      serveStaticOptions: {},
      rootPath: join(__dirname, '..'),
    }),
    AuthModule,
    UserModule,
    MediaModule,
    HealthModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
  ],
  controllers: [],
  providers: [
    PageTransferResponseInterceptor,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        {
          path: 'auth/register',
          method: RequestMethod.POST,
        },
        {
          path: 'auth/login',
          method: RequestMethod.POST,
        },
        {
          path: 'auth/logout',
          method: RequestMethod.POST,
        },
      )
      .forRoutes('*');
  }
}
