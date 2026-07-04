import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

import { GetUser } from 'src/decorators/get-user.decorator';
import { UserRoleENUM } from './user.type';
import { Roles, RolesGuard } from 'src/common/guards/roles.guard';

import { ApiQuery } from '@nestjs/swagger';
import type { LoggedInUser } from './user.type';
import { RoleDto } from './dto/role-user.dto';

@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @ApiQuery({ name: 'role', required: false })
  @Get('all')
  @Roles(UserRoleENUM.ADMIN, UserRoleENUM.SUPER_ADMIN)
  async findAll(@Query() roleDto?: RoleDto) {
    return this.usersService.findAll(roleDto);
  }

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
    return this.usersService.findById(user.id);
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
    return this.usersService.update(user.id, updateDetails);
  }

  @Delete(':id')
  @Roles(UserRoleENUM.ADMIN, UserRoleENUM.SUPER_ADMIN)
  deleteById(@Param('id') id: string) {
    return this.usersService.deleteById(id);
  }
}
