import { IsDateString, IsOptional, IsString } from '@nestjs/class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEventDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location: string;
}
