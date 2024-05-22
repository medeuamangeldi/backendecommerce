import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateTicketDto } from 'src/ticket/dto/update-ticket.dto';


@Injectable()
export class PrizeService {
  constructor(private prisma: PrismaService) {}

  async CreatePrize(userId: number, lotoDayId: number, updateTicketDto: UpdateTicketDto) {
    try {
        const prize = await this.prisma.prize.create({
            data: {
            userId: userId,
            prizeName: updateTicketDto.gift,
            lotoDayId: lotoDayId,
            },
        });
        return prize;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async getPriseByUser(userId: number) {
    try {
      const ticket = await this.prisma.prize.findMany({
        where: { userId: userId},
        select: { prizeName: true },
      });
      return ticket;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
  async getAllPrizes() {
    try {
      console.log("get all prizes");
      const ticket = await this.prisma.prize.findMany({
        select: { prizeName: true, userId: true},
      });
      return ticket;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}