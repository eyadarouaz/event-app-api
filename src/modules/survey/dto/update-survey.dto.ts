import { IsDateString, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { SurveyOption } from 'src/entities/survey-option.entity';

export class UpdateSurveyDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  question: string;

  @ApiProperty()
  @IsOptional()
  options: Array<SurveyOption>;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  dueDate: Date;
}
