import { IsDate, IsNotEmpty } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class DateRangeDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    fromDate: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    toDate: Date;
}