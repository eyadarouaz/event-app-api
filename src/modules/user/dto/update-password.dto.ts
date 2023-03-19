import { IsNotEmpty, MinLength } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdatePasswordDto {

    @ApiProperty()
    @IsNotEmpty()
    currentPassword: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(7)
    newPassword: string;
}