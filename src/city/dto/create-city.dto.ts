import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray } from 'class-validator';

export class CreateCityDto {
  @IsString()
  @ApiProperty()
  nameKz: string;

  @IsString()
  @ApiProperty()
  nameRu: string;

  @IsString()
  @ApiProperty()
  nameEn: string;

  @IsArray()
  @ApiProperty({ type: [String] })
  pickupUrls: string[];
}
