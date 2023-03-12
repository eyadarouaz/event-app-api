import { IsEmail, IsNotEmpty, MinLength } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {

    @ApiProperty()
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    email: string;

    @ApiProperty({minLength: 6})
    @IsNotEmpty()
    password: string;

}
