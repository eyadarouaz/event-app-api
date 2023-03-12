import { ApiProperty } from "@nestjs/swagger";
import { ApiPropertyOptional } from "@nestjs/swagger/dist";

export class UpdateProfileDto {

    @ApiPropertyOptional()
    firstName: string;

    @ApiPropertyOptional()
    lastName: string;

    @ApiPropertyOptional()
    birthday: Date;

    @ApiPropertyOptional()
    mobile: number;

}
