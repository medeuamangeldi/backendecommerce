import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { PrizeService } from 'src/prize/prize.service';
import { LotoDayService } from 'src/lotoday/lotoday.service';

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

  async GetLotteryTicket(userId: number) {
    try {
      const ticket = await this.prisma.lotteryTicket.findMany({
        where: { userId: userId },
        select: { combination: true },
      });
      return ticket;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async UpdateLotteryTicket(updateTicketDto: UpdateTicketDto) {
    try {
      let user = await this.prisma.lotteryTicket.update({
        where: { combination: updateTicketDto.combination },
        data: { isWin: true },
      });
      const lotoDayId = await this.lotoDayService.getActive();
      console.log(lotoDayId);
      this.prizeService.CreatePrize(user.userId, lotoDayId.id, updateTicketDto);

    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async InitLotteryTicket() {
    try {
    console.log('Seeding database')
    const result = await this.prisma.$queryRaw`SELECT COUNT(id) FROM "LotteryTicket"`;
    const count = Number(result[0].count);
    if (count === 0) {
      console.log('inint lotteryticket table')
      await this.prisma.$executeRaw`INSERT INTO "LotteryTicket" (combination) SELECT LPAD(generate_series::text, 2, '0') FROM generate_series(11,100)`;
  }else{
    throw new HttpException('LotteryTicket table already initialized', 400);
  }
 } catch (error) {
    throw new HttpException(error, 500);
  }
}
  async ResetLotteryTicket() {
    try {
      await this.prisma.lotteryTicket.updateMany({
        data: { userId: null, isWin: false },
      });
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}