import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray } from 'class-validator';

export class CreateCityDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsArray()
  @ApiProperty({ type: [String] })
  pickupUrls: string[];
}
