import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsLowercase,
} from '@nestjs/class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Role } from 'src/shared/enums/role.enum';

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsLowercase()
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Role)
  role: Role;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(7)
  password: string;
}
