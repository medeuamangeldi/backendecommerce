import { ApiProperty } from '@nestjs/swagger';
import { CartItem } from '@prisma/client';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCartDto {
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    userId: number;
}
