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
import { FilledSelfPickDateService } from './filled-self-pick-date.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateFilledSelfPickDateDto } from './dto/create-filledSelfPickDate.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';

@Controller('filled-self-pick-date')
@ApiTags('filled-self-pick-date')
export class FilledSelfPickDateController {
  constructor(
    private readonly filledSelfPickDateService: FilledSelfPickDateService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async createFilledSelfPickDate(
    @Body() createFilledSelfPickDateDto: CreateFilledSelfPickDateDto,
  ) {
    return await this.filledSelfPickDateService.create(
      createFilledSelfPickDateDto,
    );
  }

  @Get()
  async findAll() {
    return await this.filledSelfPickDateService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.filledSelfPickDateService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updateFilledSelfPickDateDto: CreateFilledSelfPickDateDto,
  ) {
    return await this.filledSelfPickDateService.update(
      +id,
      updateFilledSelfPickDateDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {
    return await this.filledSelfPickDateService.remove(+id);
  }
}
