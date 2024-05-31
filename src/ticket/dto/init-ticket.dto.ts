import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class InitTicketDto {
  @IsString()
  @ApiProperty()
  code: string;
}
