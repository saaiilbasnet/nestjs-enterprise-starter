import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { UserRoleENUM } from '../user.type';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Full Name' })
  @IsString()
  fullname!: string;

  @ApiPropertyOptional({ example: 'example@gmail.com' })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ example: UserRoleENUM.USER })
  @IsEnum(UserRoleENUM, {
    message: 'Valid role required.',
  })
  role?: UserRoleENUM;
}
