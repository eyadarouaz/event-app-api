import { IsNotEmpty, IsString } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class CreatePostDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    body: string;
}