import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDeliveryInfoDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  cartId?: number;

  @IsNumber()
  @IsOptional()
  orderId?: number;

  @IsString()
  @ApiProperty()
  fullName: string;

  @IsString()
  @ApiProperty()
  phoneNumber: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  selfPick: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty()
  postalCode: string;

  @IsNumber()
  @ApiProperty()
  cityId: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  deliveryAddress: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  comment: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  pickupUrl: string;
}
