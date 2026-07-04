import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { NextFunction, Response } from 'express';
import { User } from 'src/app/user/entities/user.entity';
import { RequestWithUser } from 'src/config/customRequest';
import { JwtPayload } from 'src/interface/jwt.interface';
import { Repository } from 'typeorm';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async use(req: RequestWithUser, _res: Response, next: NextFunction) {
    const token = req.cookies._rt_;
    if (!token)
      throw new UnauthorizedException('Unauthorized: Please login to continue');

    let decoded: JwtPayload;
    try {
      decoded = this.jwtService.verify<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Unauthorized: Invalid or expired token');
    }

    if (!decoded?.userId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const user = await this.userRepository.findOne({
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
