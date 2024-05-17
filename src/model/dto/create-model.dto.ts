import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsNumber, IsBoolean} from 'class-validator';

export class CreateModelDto {

    @IsString()
    @ApiProperty()
    name: string;

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    @ApiProperty()
    photoUrls?: string[];

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    price: number;

    @IsBoolean()
    @IsOptional()
    @ApiProperty()
    deal?: boolean;

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    productId: number;
}