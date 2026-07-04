import {
  ConflictException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto/auth.dto';
import { UserRoleENUM } from '../user/user.type';
import { env } from 'src/config/env';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(user: CreateUserDto) {
    if (
      user.role === UserRoleENUM.ADMIN ||
      user.role === UserRoleENUM.SUPER_ADMIN
    )
      throw new UnauthorizedException(
        'Unauthorised: Admin account cannot be created.',
      );

    const existingUser = await this.userRepository.findOne({
      where: { email: user.email },
      select: ['id'],
    });
    if (existingUser)
      throw new ConflictException('Username or Email already exists');

    const hashedPassword = await bcrypt.hash(user.password, 12);
    const newUser = this.userRepository.create({
      ...user,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);

    return {
      message: 'User created successfully',
    };
  }

  async login(user: LoginUserDto, res: Response) {
    const userData = await this.userRepository.findOne({
      where: { email: user.email },
      select: ['id', 'fullname', 'email', 'role', 'password'],
    });
    if (!userData) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(user.password, userData.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const expirationSeconds = env.JWT_EXPIRATION_SECONDS;
    const token = this.jwtService.sign(
      { userId: userData.id },
      { expiresIn: expirationSeconds },
    );

    res.cookie('_rt_', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: expirationSeconds * 1000,
      path: '/',
    });

    const { password: _, ...userWithoutPassword } = userData;
    return {
      loggedInUser: userWithoutPassword,
    };
  }

  logout(res: Response) {
    res.cookie('_rt_', '', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
      expires: new Date(0),
      path: '/',
    });
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Account Logged Out', success: true });
  }
}
