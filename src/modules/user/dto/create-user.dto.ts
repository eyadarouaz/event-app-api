import { IsEmail, IsNotEmpty, MinLength } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {

    @ApiProperty()
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(7)
    password: string;

}
