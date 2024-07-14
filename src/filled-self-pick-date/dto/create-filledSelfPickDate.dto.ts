import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class CreateFilledSelfPickDateDto {
  @IsDateString()
  @ApiProperty()
  date: string;

  @IsBoolean()
  @ApiProperty()
  @IsOptional()
  isFilled: boolean;

  @IsOptional()
  @ApiProperty()
  @IsNumber()
  count: number;
}
