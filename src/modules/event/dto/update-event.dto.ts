import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateEventDto {

    @ApiPropertyOptional()
    title: string;

    @ApiPropertyOptional()
    description: string;

    @ApiPropertyOptional()
    date: Date;
    
    @ApiPropertyOptional()
    location: string;

}