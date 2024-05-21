import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateFavoriteDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  modelId: number;
}
