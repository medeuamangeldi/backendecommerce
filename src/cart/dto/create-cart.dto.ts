import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

  
export class CreateCartDto {
    @IsNumber()
    @ApiProperty() 
    userId: number;

    @IsNumber()
    @ApiProperty()
    modelId: number;

    @IsNumber()
    @ApiProperty()
    quantity: number;

    @IsNumber()
    @IsOptional()
    totalPrice: number;
}