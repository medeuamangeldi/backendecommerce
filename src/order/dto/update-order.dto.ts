import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum OrderStatus {
  PROCESSING = 'PROCESSING', // формируется
  WAY = 'WAY', // в пути
  PICKUP = 'PICKUP', // ожидает в пункте выдачи
  DELIVERED = 'DELIVERED', // получен
  CANCELED = 'CANCELED', // отменен
}

export class UpdateOrderDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  trackingNumber: string;

  @IsEnum(OrderStatus)
  @IsOptional()
  @ApiProperty()
  status: OrderStatus;
}
