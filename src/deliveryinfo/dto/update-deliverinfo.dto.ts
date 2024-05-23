import { PartialType } from '@nestjs/swagger';
import { CreateDeliveryInfoDto } from './create-deliverinfo.dto';

export class UpdateDeliveryInfoDto extends PartialType(CreateDeliveryInfoDto) {}
