import { IsNotEmpty, MinLength } from "@nestjs/class-validator";

export class RegisterDto {

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @MinLength(6, {message: 'The minimum length of password is 6'})
    password: string;

}
