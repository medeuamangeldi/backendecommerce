import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

  
export class CreatePrizeDto {
    @IsString()
    @ApiProperty() 
    prizeName: string;

    @IsNumber()
    @ApiProperty()
    userId: number;

    @IsNumber()
    @ApiProperty()
    lotoDayId: number;
}