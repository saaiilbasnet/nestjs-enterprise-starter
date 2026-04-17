import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { RoleDto } from './dto/role-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { LoggedInUser, UserRoleENUM } from './user.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userEntity: Repository<User>,
    private readonly entityManager: EntityManager,

    // @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(RoleDto?: RoleDto) {
    const users = await this.userEntity.findAndCount({
      where: RoleDto ? { role: RoleDto.role } : {},
      select: ['id', 'createdAt', 'fullname', 'email', 'role'],
    });
    return users;
  }

  // async findAll(filter: UserFilterDTO) {
  //   const { searchTerm, ...query } = filter;
  //   const where: FindOptionsWhere<User> = {};
  //   const { take, skip } = generateTakeSkip(query);
  //   if (searchTerm) where.fullname = ILike(`%${searchTerm}%`);
  //   const users = await this.userEntity.findAndCount({
  //     where,
  //     take,
  //     skip,
  //     select: ['id', 'createdAt', 'fullname', 'email', 'role'],
  //     order: {
  //       createdAt: 'DESC',
  //     },
  //   });
  //   return users;
  // }

  async findById(id: string) {
    const user = await this.userEntity.findOne({
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
    const userData = await this.userEntity.findOne({ where: { id } });

    if (!userData) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Block any attempt to set role to ADMIN or SUPER_ADMIN
    if (
      updateDetails.role === UserRoleENUM.ADMIN ||
      updateDetails.role === UserRoleENUM.SUPER_ADMIN
    ) {
      throw new UnauthorizedException(
        'Unauthorised: Admin or Super Admin role cannot be assigned.',
      );
    }

    // Prevent modifying an admin or super admin account (and don't update their role)
    if (
      userData.role === UserRoleENUM.ADMIN ||
      userData.role === UserRoleENUM.SUPER_ADMIN
    ) {
      // remove role from updateDetails so it never updates
      if ('role' in updateDetails) {
        delete updateDetails.role;
      }

      throw new UnauthorizedException(
        'Unauthorised: Admin or Super Admin account cannot be modified.',
      );
    }

    this.userEntity.merge(userData, updateDetails);
    await this.entityManager.save(userData);

    return {
      message: 'User details updated successfully',
      success: true,
      updateDetails,
    };
  }

  async deleteById(id: string) {
    const user = await this.userEntity.findOneBy({ id });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    void this.userEntity.softDelete(user.id);
    return {
      message: `User: ${id} Deleted Successfully`,
      success: true,
    };
  }
}
