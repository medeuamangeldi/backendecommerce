import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsBoolean()
  @ApiProperty()
  payStatus: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty()
  trackingNumber: string;
}
