import { IsString } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdatePostDto {
    
    @ApiProperty()
    @IsString()
    body: string;
    
}