import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/app/user/entities/user.entity';
import { RequestWithUser } from 'src/config/customRequest';
import { env } from 'src/config/env';
import { JwtPayload } from 'src/interface/jwt.interface';
import { Repository } from 'typeorm';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User)
    private readonly userEntity: Repository<User>,
  ) {}

  async use(req: RequestWithUser, _res: Response, next: NextFunction) {
    const token = req.cookies._rt_;
    if (!token)
      throw new UnauthorizedException('Unauthorized: Please login to continue');

    const decoded = jwt.verify(token, env.JWT_SECRET!) as unknown as JwtPayload;

    if (!decoded?.userId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const user = await this.userEntity.findOne({
      where: { id: decoded.userId },
      select: ['id', 'fullname', 'email', 'role'],
    });

    if (!user)
      throw new UnauthorizedException('Unauthorized: Invalid User Credentials');

    req.user = {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
    };
    next();
  }
}
