import { ApiProperty } from "@nestjs/swagger";
import { MinLength } from "class-validator";

export class UpdateUserDto {

    @ApiProperty()
    username: string;

    @ApiProperty()
    @MinLength(7)
    password: string;
}