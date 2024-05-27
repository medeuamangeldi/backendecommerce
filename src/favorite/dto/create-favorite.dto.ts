import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFavoriteDto {
  @IsInt()
  @IsOptional()
  @ApiProperty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  modelId: number;
}
