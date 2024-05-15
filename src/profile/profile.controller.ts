import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
@ApiTags('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}
  @Post()
  async create(@Body() createProfileDto: CreateProfileDto) {
    return await this.profileService.create(createProfileDto);
  }

  @Get(':userId')
  async findOneByUserId(@Param('userId') userId: string) {
    return await this.profileService.findOneByUserId(+userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return await this.profileService.update(+id, updateProfileDto);
  }
}
