import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePrizeDto } from './dto/update-prize.dto';
import { CreatePrizeDto } from './dto/create-prize.dto';
import { MixpanelService } from 'src/mixpanel/mixpanel.service';

@Injectable()
export class PrizeService {
  constructor(
    private prisma: PrismaService,
    private readonly mixpanelService: MixpanelService,
  ) {}

  async CreatePrize(
    userId: number,
    createPrizeDto: CreatePrizeDto,
    combination: string,
  ) {
    try {
      const prize = await this.prisma.prize.create({
        data: {
          userId: userId,
          prizeName: createPrizeDto.prizeName,
          lotoDayId: createPrizeDto.lotoDayId,
        },
      });
      if (prize) {
        this.mixpanelService.track('PRIZE_GIVEN', {
          distinct_id: userId,
          prizeName: createPrizeDto.prizeName,
          combination: combination,
        });
        await this.prisma.lotteryTicket.update({
          where: { combination: combination },
          data: { isWin: true },
        });
        return prize;
      }
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

  async getAllPrize() {
    try {
      const prizes = await this.prisma.prize.findMany({
        select: {
          id: true,
          prizeName: true,
          lotoDay: { select: { lotoDate: true } },
          user: {
            select: {
              phoneNumber: true,
              profile: { select: { firstName: true, lastName: true } },
            },
          },
        },
      });
      return prizes;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
