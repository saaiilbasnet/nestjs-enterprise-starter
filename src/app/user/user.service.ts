import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleDto } from './dto/role-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { LoggedInUser, UserRoleENUM } from './user.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(roleDto?: RoleDto) {
    const users = await this.userRepository.findAndCount({
      where: roleDto?.role ? { role: roleDto.role } : {},
      select: ['id', 'createdAt', 'fullname', 'email', 'role'],
      order: { createdAt: 'DESC' },
    });
    return users;
  }

  async findById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'createdAt', 'fullname', 'email', 'role'],
    });

    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    return user;
  }

  getProfile(user: LoggedInUser) {
    return {
      message: 'Logged-In User Data',
      user,
    };
  }

  async update(id: string, updateDetails: UpdateUserDto) {
    const userData = await this.userRepository.findOne({ where: { id } });

    if (!userData) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (
      updateDetails.role === UserRoleENUM.ADMIN ||
      updateDetails.role === UserRoleENUM.SUPER_ADMIN
    ) {
      throw new UnauthorizedException(
        'Unauthorised: Admin or Super Admin role cannot be assigned.',
      );
    }

    if (
      userData.role === UserRoleENUM.ADMIN ||
      userData.role === UserRoleENUM.SUPER_ADMIN
    ) {
      throw new UnauthorizedException(
        'Unauthorised: Admin or Super Admin account cannot be modified.',
      );
    }

    this.userRepository.merge(userData, updateDetails);
    await this.userRepository.save(userData);

    return {
      message: 'User details updated successfully',
      success: true,
    };
  }

  async deleteById(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    await this.userRepository.softDelete(user.id);
    return {
      message: `User: ${id} Deleted Successfully`,
      success: true,
    };
  }
}
