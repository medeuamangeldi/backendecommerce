import {
    Body,
    Controller,
    Post,
    UseGuards,
    Param,
    Patch,
    Delete,
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  import { CreateDeliveryInfoDto } from './dto/create-deliverinfo.dto';
  import { UpdateDeliveryInfoDto } from './dto/update-deliverinfo.dto';
  import { DeliveryInfoService } from './deliverInfo.service';
  import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
  
  @Controller('delivery')
  @ApiTags('delivery')
  export class CartController {
    constructor(private deliveryInfoService: DeliveryInfoService) {}
  
    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async createDeliveryByCart(@Body() createDeliveryInfoDto: CreateDeliveryInfoDto) {
      return await this.deliveryInfoService.createDeliveryByCart(createDeliveryInfoDto);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async updateDeliveryInfo(@Param('id') id: string, @Body() updateDeliveryInfoDto: UpdateDeliveryInfoDto) {
      return await this.deliveryInfoService.updateDeliveryInfo(+id, updateDeliveryInfoDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async deleteDeliveryInfo(@Param('id') id: string) {
      return await this.deliveryInfoService.deleteDeliveryInfo(+id);
    }
}