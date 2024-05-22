import { PartialType } from '@nestjs/swagger';
import { CreateLotoDayDto } from './create-lotoday.dto';

export class UpdateLotoDayDto extends PartialType(CreateLotoDayDto) {}