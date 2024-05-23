import { PartialType } from '@nestjs/swagger';
import { CreateCartItemDto } from './create-cartitem.dto';

export class UpdateCartItemDto extends PartialType(CreateCartItemDto) {}
