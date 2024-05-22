import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLotoDayDto } from './dto/create-lotoday.dto';



@Injectable()
export class LotoDayService {
  constructor(private prisma: PrismaService) {}

  async getActive() {
    try {
        return await this.prisma.lotoDay.findFirst({where: {isActive: true}, select: {id: true}});
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
  async CreateLotoDay(data: CreateLotoDayDto) {
    try {
      console.log(data);
      return await this.prisma.lotoDay.create({ data });
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}