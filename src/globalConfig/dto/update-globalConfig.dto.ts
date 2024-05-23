import { PartialType } from '@nestjs/swagger';
import { CreateGlobalConfigDto } from './create-globalConfig.dto';

export class UpdateGlobalConfigDto extends PartialType(CreateGlobalConfigDto) {}