import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional} from 'class-validator';

  
export  class CreateGlobalConfigDto {
    @IsBoolean()
    @IsOptional()
    @ApiProperty()
    isDealActive: boolean;

    @IsBoolean()
    @IsOptional()
    @ApiProperty()
    isBuyActive: boolean;
}