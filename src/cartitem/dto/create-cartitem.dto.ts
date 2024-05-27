import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class CreateCartItemDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty()
  cartId?: number;

  @IsOptional()
  @IsNumber()
  orderId?: number;

  @IsNumber()
  @ApiProperty()
  modelId: number;

  @IsNumber()
  @Min(1)
  @ApiProperty()
  quantity: number;

  @IsNumber()
  @IsOptional()
  totalPrice: number;
}
