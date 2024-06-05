import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGlobalConfigDto {
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  isDealActive: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  isBuyActive: boolean;

  @IsOptional()
  @ApiProperty()
  @IsNumber()
  ticketPrice: number;

  @IsOptional()
  @ApiProperty()
  @IsString()
  ofertaUrl: string;
}
