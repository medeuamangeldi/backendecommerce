import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsNumber()
  @ApiProperty()
  userId: number;

  @IsString()
  @ApiProperty()
  combination: string;
}
