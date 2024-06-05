import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
  IsBoolean,
} from 'class-validator';

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
  @ApiProperty()
  price: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  deal?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty()
  descriptionRu?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  descriptionKz?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  descriptionEn?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  detailedDescriptionRu?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  detailedDescriptionKz?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  detailedDescriptionEn?: string;

  @IsNumber()
  @ApiProperty()
  productId: number;

  @IsNumber()
  @ApiProperty()
  inStockCount: number;
}
