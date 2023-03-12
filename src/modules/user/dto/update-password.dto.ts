import { IsNotEmpty } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdatePasswordDto {

    @ApiProperty()
    @IsNotEmpty()
    currentPassword: string;

    @ApiProperty()
    @IsNotEmpty()
    newPassword: string;
}