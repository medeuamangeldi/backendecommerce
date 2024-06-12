import {
  Controller,
  Get,
  UseGuards,
  Req,
  Patch,
  Body,
  Param,
  Query,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { TicketService } from './ticket.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RoleGuard } from 'src/auth/roles.guard';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InitTicketDto } from './dto/init-ticket.dto';
import { Request } from 'express';

@Controller('ticket')
@ApiTags('ticket')
export class TicketController {
  constructor(private ticketService: TicketService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getLotteryTickets(@Req() req: Request) {
    const userId = req.user['id'];
    return await this.ticketService.GetLotteryTickets(+userId);
  }

  @Get('/combination')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiQuery({ name: 'combination', required: false })
  @ApiBearerAuth()
  async getLotteryTicket(@Query('combination') combination: string) {
    return await this.ticketService.GetLotteryTicket(combination);
  }

  @Patch('win')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async updateLotteryTicketWin(@Body() updateTicketDto: UpdateTicketDto) {
    return await this.ticketService.UpdateLotteryTicketWin(updateTicketDto);
  }

  @Patch('loss')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async updateLotteryTicketLoss(@Body() updateTicketDto: UpdateTicketDto) {
    return await this.ticketService.UpdateLotteryTicketLoss(updateTicketDto);
  }

  @Post('init')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async InitLotteryTicket(@Body() initTicketDto: InitTicketDto) {
    return await this.ticketService.InitLotteryTicket(initTicketDto);
  }

  @Patch('reset')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async resetLotteryTicket(@Body() initTicketDto: InitTicketDto) {
    return await this.ticketService.ResetLotteryTicket(initTicketDto);
  }
}
