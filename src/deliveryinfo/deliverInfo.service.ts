import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDeliveryInfoDto } from './dto/create-deliverinfo.dto';
import { UpdateDeliveryInfoDto } from './dto/update-deliverinfo.dto';

@Injectable()
export class DeliveryInfoService {
  constructor(private prisma: PrismaService) {}


  async createDeliveryByCart(data: CreateDeliveryInfoDto) {
    try {
      return await this.prisma.deliveryInfo.create({ data })
    } catch (error) {
      throw new HttpException(error, 404);
    }
  }

  async updateDeliveryInfo(id: number, data: UpdateDeliveryInfoDto) {
    try {
      return await this.prisma.deliveryInfo.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new HttpException(error, 404);
    }
  }

  async deleteDeliveryInfo(id: number) {
    try {
      return await this.prisma.deliveryInfo.delete({
        where: { id },
      });
    } catch (error) {
      throw new HttpException(error, 404);
    }
  }
}
