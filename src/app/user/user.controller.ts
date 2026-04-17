import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

import { GetUser } from 'src/decorators/get-user.decorator';
import { UserRoleENUM } from './user.type';

import { ApiQuery } from '@nestjs/swagger';
import type { LoggedInUser } from './user.type';
import { RoleDto } from './dto/role-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @ApiQuery({ name: 'role', required: false })
  @Get('all')
  async findAll(@GetUser() user: LoggedInUser, @Query() RoleDto?: RoleDto) {
    if (
      user.role === UserRoleENUM.ADMIN ||
      user.role === UserRoleENUM.SUPER_ADMIN
    )
      return this.usersService.findAll(RoleDto);
    else
      throw new UnauthorizedException(
        'Unauthorised: No permission for this route.',
      );
  }

  // @Get()
  // findAll(@Query() filter: UserFilterDTO) {
  //   return this.usersService.findAll(filter);
  // }

  @Get('profile')
  getProfile(@GetUser() user: LoggedInUser) {
    return this.usersService.getProfile(user);
  }

  @Get(':id')
  findById(@Param('id') id: string, @GetUser() user: LoggedInUser) {
    if (
      user.role === UserRoleENUM.ADMIN ||
      user.role === UserRoleENUM.SUPER_ADMIN
    )
      return this.usersService.findById(id);
    else return this.usersService.findById(user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDetails: UpdateUserDto,
    @GetUser() user: LoggedInUser,
  ) {
    if (
      user.role === UserRoleENUM.ADMIN ||
      user.role === UserRoleENUM.SUPER_ADMIN
    )
      return this.usersService.update(id, updateDetails);
    else return this.usersService.update(user.id, updateDetails);
  }

  @Delete(':id')
  deleteById(@Param('id') id: string, @GetUser() user: LoggedInUser) {
    if (
      user.role === UserRoleENUM.ADMIN ||
      user.role === UserRoleENUM.SUPER_ADMIN
    )
      return this.usersService.deleteById(id);
    throw new UnauthorizedException(
      'Unauthorised: No permission for this route.',
    );
  }
}
