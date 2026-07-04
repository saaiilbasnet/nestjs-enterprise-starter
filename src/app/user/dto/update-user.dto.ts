import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRoleENUM } from '../user.type';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Full Name' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullname?: string;

  @ApiPropertyOptional({ example: 'example@gmail.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({ example: UserRoleENUM.USER })
  @IsOptional()
  @IsEnum(UserRoleENUM, {
    message: 'Valid role required.',
  })
  role?: UserRoleENUM;
}
