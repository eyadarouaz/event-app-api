import { IsNotEmpty, minLength } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {

    @ApiProperty()
    @IsNotEmpty()
    login: string;

    @ApiProperty({minLength: 6})
    @IsNotEmpty()
    password: string;
    
}