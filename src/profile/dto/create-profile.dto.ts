import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  lastName: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  userId: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  avatarUrl: string;
}
