import { PartialType } from '@nestjs/swagger';
import { CreateFilledSelfPickDateDto } from './create-filledSelfPickDate.dto';

export class UpdateFilledSelfPickDateDto extends PartialType(
  CreateFilledSelfPickDateDto,
) {}
