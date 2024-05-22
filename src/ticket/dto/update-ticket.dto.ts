import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString} from 'class-validator';


export class UpdateTicketDto {
    @IsString()
    @ApiProperty()
    combination: string;

    @IsString()
    @ApiProperty()
    gift: string;
}