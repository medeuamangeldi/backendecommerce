import {
    Body,
    Controller,
    Post,
    UseGuards,
    Param,
    Patch,
    Delete,
    Get,
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  import { CreateGlobalConfigDto } from './dto/create-globalConfig.dto';
  import { UpdateGlobalConfigDto } from './dto/update-globalConfig.dto';
  import { GlobalConfigService } from './globalConfig.service';
  import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
  import { Roles } from 'src/auth/roles/roles.decorator';
  import { RoleGuard } from 'src/auth/roles.guard';
  
  @Controller('globalConfig')
  @ApiTags('globalConfig')
  export class GlobalConfigController {
    constructor(private globalConfigService: GlobalConfigService) {}
  
    @Post()
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    async createGlobalConfig(@Body() createGlobalConfigDto: CreateGlobalConfigDto) {
      return await this.globalConfigService.createGC(createGlobalConfigDto);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    async updateGlobalConfig(@Param('id') id: string, @Body() updateGlobalConfigDto: UpdateGlobalConfigDto) {
      return await this.globalConfigService.updateGC(+id, updateGlobalConfigDto);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    async getGlobalConfig(@Param('id') id: string) {
      return await this.globalConfigService.getGC(+id);
    }
}