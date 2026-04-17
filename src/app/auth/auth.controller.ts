import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto/auth.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register') // POST /user/register
  createUser(@Body() newUser: CreateUserDto) {
    return this.authService.createUser(newUser);
  }

  @Post('login') // POST /user/login
  login(@Body() user: LoginUserDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(user, res);
  }

  @Post('logout') //POST /user/logout
  logout(@Res() res: Response) {
    return this.authService.logout(res);
  }
}
