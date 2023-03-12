import { ApiProperty } from "@nestjs/swagger";

export class UpdatePostDto {
    
    @ApiProperty()
    body: string;
    
}