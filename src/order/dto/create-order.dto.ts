import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString} from 'class-validator';

export class CreateOrderDto {
    @IsBoolean()
    @ApiProperty()
    payStatus: boolean;
}