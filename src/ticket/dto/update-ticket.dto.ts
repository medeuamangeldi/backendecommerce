import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString} from 'class-validator';


export class UpdateTicketDto {

    @IsNumber()
    @ApiProperty()
    lotoDayId: number;

    @IsString()
    @ApiProperty()
    combination: string;

    @IsString()
    @ApiProperty()
    prize: string;
}