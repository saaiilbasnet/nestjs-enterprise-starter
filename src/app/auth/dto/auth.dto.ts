import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRoleENUM } from 'src/app/user/user.type';

export class LoginUserDto {
  @ApiProperty({ example: 'example@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'example' })
  @IsNotEmpty()
  password!: string;
}

export class CreateUserDto {
  @ApiProperty({ example: 'example' })
  @IsString()
  fullname!: string;

  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'example' })
  @IsNotEmpty()
  @IsString()
  password!: string;

  @ApiProperty({ example: UserRoleENUM.USER })
  @IsEnum(UserRoleENUM, {
    message: 'Valid role required.',
  })
  role!: UserRoleENUM;
}
