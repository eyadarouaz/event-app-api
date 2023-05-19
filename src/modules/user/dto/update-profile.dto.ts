import { IsEmail, IsOptional, IsString } from '@nestjs/class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger/dist';
import { IsNumberString } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  username: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  // @IsDate()
  birthday: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  mobile: number;
}
