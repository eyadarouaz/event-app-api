import { IsNotEmpty } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class DateRangeDto {

    @ApiProperty()
    @IsNotEmpty()
    fromDate: Date;

    @ApiProperty()
    @IsNotEmpty()
    toDate: Date;
}