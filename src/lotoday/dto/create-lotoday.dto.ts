import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class CreateLotoDayDto {
  @IsDateString()
  @ApiProperty()
  lotoDate: Date;
}
