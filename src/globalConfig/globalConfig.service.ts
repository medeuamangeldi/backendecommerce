import { Injectable, NotFoundException, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGlobalConfigDto } from './dto/create-globalConfig.dto';
import { UpdateGlobalConfigDto } from './dto/update-globalConfig.dto';

@Injectable()
export class GlobalConfigService {
  constructor(private prisma: PrismaService) {}

  async createGC(data: CreateGlobalConfigDto) {
    const existingConfigs = await this.prisma.globalConfig.findMany();
    if (existingConfigs.length > 0) {
      throw new HttpException('GlobalConfig already exists', 400);
    }

    return await this.prisma.globalConfig.create({ data });
  }

  async updateGC(id: number, data: UpdateGlobalConfigDto) {
    const gc = await this.prisma.globalConfig.findUnique({
      where: { id },
    });
    if (!gc) {
      throw new NotFoundException('GlobalConfig not found');
    }
    return await this.prisma.globalConfig.update({
      where: { id },
      data,
    });
  }
  async getGC() {
    const gc = await this.prisma.globalConfig.findFirst({
      select: {
        isDealActive: true,
        isBuyActive: true,
        ticketPrice: true,
        deliveryPricePerKg: true,
        ofertaUrl: true,
        id: true,
      },
    });
    if (!gc) {
      throw new NotFoundException('GlobalConfig not found');
    }
    return gc;
  }

  async getIsDealActive() {
    const gc = await this.prisma.globalConfig.findFirst({
      select: { isDealActive: true },
    });
    if (!gc) {
      throw new NotFoundException('GlobalConfig not found');
    }
    return gc;
  }

  async getIsBuyActive() {
    const gc = await this.prisma.globalConfig.findFirst({
      select: { isBuyActive: true },
    });
    if (!gc) {
      throw new NotFoundException('GlobalConfig not found');
    }
    return gc;
  }

  async getTicketPrice() {
    const gc = await this.prisma.globalConfig.findFirst({
      select: { ticketPrice: true },
    });
    if (!gc) {
      throw new NotFoundException('GlobalConfig not found');
    }
    return gc;
  }

  async getDeliveryPricePerKg() {
    const gc = await this.prisma.globalConfig.findFirst({
      select: { deliveryPricePerKg: true },
    });
    if (!gc) {
      throw new NotFoundException('GlobalConfig not found');
    }
    return gc;
  }
}
