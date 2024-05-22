import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrizeModule } from 'src/prize/prize.module';
import { LotoDayModule } from 'src/lotoday/lotoday.module';

@Module({
  imports: [PrismaModule, PrizeModule, LotoDayModule],
  providers: [TicketService],
  controllers: [TicketController],
  exports: [TicketService],
})
export class TicketModule {}