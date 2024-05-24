import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Lang } from '@prisma/client'; // Import Lang from the generated Prisma client

export class ChangeLanguageDto {
  @IsEnum(Lang)
  @ApiProperty({ enum: Lang })
  language: Lang;
}
