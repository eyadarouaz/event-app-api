import { ApiProperty } from "@nestjs/swagger";
import { SurveyOption } from "src/entities/survey-option.entity";

export class CreateSurveyDto {

    @ApiProperty()
    title: string;

    @ApiProperty()
    question: string;

    @ApiProperty()
    options: Array<SurveyOption>;

    @ApiProperty()
    dueDate: Date;

}