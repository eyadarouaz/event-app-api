import { IsNotEmpty } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateEventDto {

    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    @IsNotEmpty()
    date: Date;
    
    @ApiProperty()
    location: string;

}