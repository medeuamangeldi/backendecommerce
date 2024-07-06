import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFaqDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  questionKz: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  questionRu: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  answerKz: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  answerRu: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  questionEn: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  answerEn: string;
}
