import {
  ConflictException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { env } from 'src/config/env';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto/auth.dto';
import { UserRoleENUM } from '../user/user.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userEntity: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  async createUser(user: CreateUserDto) {
    if (
      user.role === UserRoleENUM.ADMIN ||
      user.role === UserRoleENUM.SUPER_ADMIN
    )
      throw new UnauthorizedException(
        'Unauthorised: Admin account cannot be created.',
      );

    const existingUser = await this.userEntity.findOne({
      where: { email: user.email },
    });
    if (existingUser)
      throw new ConflictException('Username or Email already exists');

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = this.userEntity.create({
      ...user,
      password: hashedPassword,
    });

    await this.entityManager.save(newUser);

    return {
      message: 'User created successfully',
    };
  }

  async login(user: LoginUserDto, res: Response) {
    const JWT_SECRET = env.JWT_SECRET;

    const userData = await this.userEntity.findOne({
      where: { email: user.email },
    });
    if (!userData) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(user.password, userData.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const token = jwt.sign({ userId: userData.id }, JWT_SECRET!, {
      expiresIn: '7d',
    });

    res.cookie('_rt_', token, {
      httpOnly: true,
      secure: true, // true for swagger and production in https
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      // maxAge: 60 * 60 * 1000, // 1 hr
    });

    const expiryTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const formattedExpiryTime = expiryTime.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kathmandu',
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = userData;
    return {
      loggedInUser: userWithoutPassword,
      expiryTime: formattedExpiryTime,
    };
  }

  logout(res: Response) {
    res.cookie('_rt_', '', {
      expires: new Date(0),
    });
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Account Logged Out', success: true });
  }
}
