import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @ApiProperty()
  nameKz: string;

  @IsString()
  @ApiProperty()
  nameRu: string;

  @IsString()
  @ApiProperty()
  nameEn: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  photoUrl: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  iconUrl: string;
}
