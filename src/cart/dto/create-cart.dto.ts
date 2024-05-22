import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString} from 'class-validator';

  
export  class CreateDeliveryInfo {
    @IsString()
    username: string;
  
    @IsString()
    phone: string;

    @IsBoolean()
    @IsOptional()
    selfPick: boolean;

    @IsString()
    @IsOptional()
    postalCode: string;

    @IsNumber()
    cityId: number;

    @IsString()
    @IsOptional()
    deliveryAddress: string;

    @IsString()
    @IsOptional()
    comment: string;

    @IsString()
    @IsOptional()
    pickupUrl: string;
  }

export class CreateCartItemDto {
    @IsNumber()
    @ApiProperty()
    modelId: number;

    @IsNumber()
    @ApiProperty()
    quantity: number;
}