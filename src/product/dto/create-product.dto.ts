import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  categoryId: number;

  @IsArray()
  @IsOptional()
  @ApiProperty({ type: [String] })
  photoUrls: string[];
}
