import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RoleGuard } from 'src/auth/roles.guard';

@Controller('faq')
@ApiTags('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getOne(@Param('id') id: string) {
    return await this.faqService.getOneFaq(+id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getAll() {
    return await this.faqService.getAllFaqs();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async create(@Body() data: CreateFaqDto) {
    return await this.faqService.createFaq(data);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() data: CreateFaqDto) {
    return await this.faqService.updateFaq(+id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async delete(@Param('id') id: string) {
    return await this.faqService.deleteFaq(+id);
  }
}
