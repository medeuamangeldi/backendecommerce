import {
    Controller,
    Get,
    UseGuards,
    Req,
    Patch,
    Body,
    Post,
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  import { TicketService } from './ticket.service';
  import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
  import { Request } from 'express';
  import { Roles } from 'src/auth/roles/roles.decorator';
  import { RoleGuard } from 'src/auth/roles.guard';
  import { UpdateTicketDto } from './dto/update-ticket.dto';

  
  @Controller('ticket')
  @ApiTags('ticket')
  export class TicketController {
    constructor(private ticketService: TicketService) {}
    
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getLotteryTicket(@Req() req: Request) {
    let userId = req.user["id"];
    return await this.ticketService.GetLotteryTicket(userId);
  }

  @Patch('gift')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async updateLotteryTicket(@Body() updateTicketDto: UpdateTicketDto){
    return await this.ticketService.UpdateLotteryTicket(updateTicketDto);
  }

  @Post('init')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async InitLotteryTicket(){
    return await this.ticketService.InitLotteryTicket();
  }

  @Patch('reset')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async resetLotteryTicket(){
    return await this.ticketService.ResetLotteryTicket();
  }
}