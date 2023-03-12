import { IsNotEmpty } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePostDto {

    @ApiProperty()
    @IsNotEmpty()
    body: string;
}