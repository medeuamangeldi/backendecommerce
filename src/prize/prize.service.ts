import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateTicketDto } from 'src/ticket/dto/update-ticket.dto';
import { UpdatePrizeDto } from './dto/update-prize.dto';
import { CreatePrizeDto } from './dto/create-prize.dto';

@Injectable()
export class PrizeService {
  constructor(private prisma: PrismaService) {}

  async CreatePrize(userId: number, createPrizeDto: CreatePrizeDto) {
    try {
      const prize = await this.prisma.prize.create({
        data: {
          userId: userId,
          prizeName: createPrizeDto.prizeName,
          lotoDayId: createPrizeDto.lotoDayId,
        },
      });
      return prize;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
  async UpdatePrize(id: number, data: UpdatePrizeDto) {
    try {
      const prize = await this.prisma.prize.update({
        where: { id: id },
        data,
      });
      return prize;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async deletePrize(id: number) {
    try {
      const prize = await this.prisma.prize.delete({
        where: { id: id },
      });
      return prize;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
  async getPriseByUser(userId: number) {
    try {
      const ticket = await this.prisma.prize.findMany({
        where: { userId: userId },
        select: {
          id: true,
          prizeName: true,
          lotoDay: { select: { lotoDate: true } },
        },
      });
      return ticket;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
