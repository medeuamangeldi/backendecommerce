import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

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
}
