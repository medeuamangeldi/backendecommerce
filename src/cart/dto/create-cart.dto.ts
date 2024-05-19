import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsJSON, IsNumber, IsObject, IsOptional, IsString, ValidateNested} from 'class-validator';

class DataItemDTO {
    @IsNumber()
    modelID: number;
  
    @IsNumber()
    quantity: number;
  }
  
  class AddressDTO {
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

export class CreateCartDto {
    @IsArray()
    @ValidateNested()
    @Type(() => DataItemDTO)    
    @ApiProperty()
    data: DataItemDTO[];

    @IsObject()
    @ValidateNested()
    @Type(() => AddressDTO)
    @ApiProperty()
    address: AddressDTO;
}
