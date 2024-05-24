import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString, IsDate, IsDateString} from 'class-validator';

export class CreateLotoDayDto {
    @IsDateString()
    @ApiProperty()
    lotoDate: Date;
}