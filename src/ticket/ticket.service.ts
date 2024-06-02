import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { PrizeService } from 'src/prize/prize.service';
import { LotoDayService } from 'src/lotoday/lotoday.service';
import { InitTicketDto } from './dto/init-ticket.dto';

@Injectable()
export class TicketService {
  constructor(
    private prisma: PrismaService,
    private readonly prizeService: PrizeService,
    private readonly lotoDayService: LotoDayService,
  ) {}

  async CreateLotteryTicket(userId: number, count: number) {
    try {
      const ticket = await this.prisma.$queryRaw`
        UPDATE "LotteryTicket" 
        SET "userId"= ${userId} 
        where "id" in (select "id" from "LotteryTicket" where "userId" is null ORDER BY random() limit ${count})
        RETURNING "combination"`;
      return ticket;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async GetLotteryTickets(userId: number) {
    try {
      const ticket = await this.prisma.lotteryTicket.findMany({
        where: { userId: userId },
        select: {
          userId: true,
          combination: true,
          isWin: true,
        },
      });
      return ticket;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async UpdateLotteryTicket(updateTicketDto: UpdateTicketDto) {
    try {
      const user = await this.prisma.lotteryTicket.update({
        where: { combination: updateTicketDto.combination },
        data: { isWin: true },
      });
      return this.prizeService.CreatePrize(user.userId, updateTicketDto);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async InitLotteryTicket(data: InitTicketDto) {
    try {
      if (data.code !== process.env.JWT_SECRET) {
        throw new HttpException('Invalid code', 400);
      }
      const result = await this.prisma
        .$queryRaw`SELECT COUNT(id) FROM "LotteryTicket"`;
      const count = Number(result[0].count);
      if (count === 0) {
        await this.prisma
          .$executeRaw`INSERT INTO "LotteryTicket" (combination) SELECT LPAD(generate_series::text, 6, '0') FROM generate_series(0,999999)`;
      } else {
        throw new HttpException('LotteryTicket table already initialized', 400);
      }
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
  async ResetLotteryTicket(data: InitTicketDto) {
    try {
      if (data.code !== process.env.JWT_SECRET) {
        throw new HttpException('Invalid code', 400);
      }
      await this.prisma.lotteryTicket.updateMany({
        data: { isWin: false },
      });
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
