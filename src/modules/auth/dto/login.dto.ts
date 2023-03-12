import { IsNotEmpty} from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {

    @ApiProperty()
    @IsNotEmpty()
    login: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;
    
}
