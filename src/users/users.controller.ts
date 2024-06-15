import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { IsNumber } from 'class-validator';
import { Request } from 'express';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  @ApiBearerAuth()
  async getUsers(
    @Query('search') search: string,
    @Query('dateFrom') dateFrom: Date,
    @Query('dateTo') dateTo: Date,
    @Query() { limit = 10, skip = 0 },
  ) {
    const payload = { search, dateFrom, dateTo, limit, skip };
    return await this.usersService.getUsers(payload);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  async getUserById(@Param('id') id: string) {
    return await this.usersService.findOne(+id);
  }

  @Get('me/profile')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  async getMe(@Req() req: Request) {
    const id = req.user['id'];
    return await this.usersService.findOne(+id);
  }

  @Get('prize/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('USER', 'ADMIN')
  @ApiBearerAuth()
  async getUserPrizes(@Param('id') id: string) {
    return await this.usersService.getUserPrizes(+id);
  }

  @Get('combination/ticket')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiQuery({ name: 'combination', required: false })
  @ApiBearerAuth()
  async getUserByTicket(@Query('combination') combination: string) {
    return await this.usersService.getUserByTicket(combination);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(+id, updateUserDto);
  }

  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @Roles('ADMIN')
  async activateUser(@Param('id') id: string) {
    return await this.usersService.activateUser(+id);
  }

  @Patch(':id/deactivate')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @Roles('ADMIN')
  async deactivateUser(@Param('id') id: string) {
    return await this.usersService.deactivateUser(+id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteUser(@Param('id') id: string) {
    return await this.usersService.remove(+id);
  }
}
