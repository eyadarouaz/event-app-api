import { IsNotEmpty, IsDate, IsString } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsDateString } from "class-validator";

export class CreateEventDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    startDate: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    endDate: Date;
    
    @ApiProperty()
    @IsString()
    location: string;

}