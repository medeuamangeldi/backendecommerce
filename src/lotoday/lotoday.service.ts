import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLotoDayDto } from './dto/create-lotoday.dto';
import { UpdateLotoDayDto } from './dto/update-lotoday.dto';

@Injectable()
export class LotoDayService {
  constructor(private prisma: PrismaService) {}
  async CreateLotoDay(data: CreateLotoDayDto) {
    try {
      return await this.prisma.lotoDay.create({ data });
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
  async getAllLotoDay() {
    try {
      return await this.prisma.lotoDay.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
  async updateLotoDay(id: number, data: UpdateLotoDayDto) {
    try {
      return await this.prisma.lotoDay.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
