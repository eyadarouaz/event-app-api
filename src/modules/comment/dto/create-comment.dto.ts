import { IsNotEmpty } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateCommentDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    body: string;
    
}