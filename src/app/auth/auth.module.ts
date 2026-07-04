import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthMiddleware } from './auth.middleware';
import { AuthService } from './auth.service';
import { env } from 'src/config/env';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: env.JWT_EXPIRATION_SECONDS },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule implements NestModule {
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
        {
          path: 'health',
          method: RequestMethod.GET,
        },
      )
      .forRoutes('*path');
  }
}
