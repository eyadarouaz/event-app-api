import { IsString } from "@nestjs/class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, MinLength } from "class-validator";

export class UpdateUserDto {

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    username: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MinLength(7)
    password: string;
}