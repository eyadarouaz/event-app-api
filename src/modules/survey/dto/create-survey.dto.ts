import { IsDateString, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SurveyOption } from 'src/entities/survey-option.entity';

export class CreateSurveyDto {
  @ApiProperty()
  @IsString()
  question: string;

  @ApiProperty()
  options: Array<SurveyOption>;

  @ApiProperty()
  @IsDateString()
  dueDate: Date;
}
