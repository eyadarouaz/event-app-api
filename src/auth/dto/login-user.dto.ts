import { IsNotEmpty } from "@nestjs/class-validator";

export class LoginDto {

    @IsNotEmpty()
    usernameOrEmail: string;

    @IsNotEmpty()
    password: string;
    
}