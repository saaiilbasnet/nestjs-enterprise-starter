import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { UserRoleENUM } from '../user.type';

export class RoleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(UserRoleENUM, {
    message: 'Valid role required',
  })
  role?: UserRoleENUM;
}
