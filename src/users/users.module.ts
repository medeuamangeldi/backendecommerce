import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProfileModule } from 'src/profile/profile.module';
import { MixpanelService } from 'src/mixpanel/mixpanel.service';

@Module({
  imports: [PrismaModule, ProfileModule],
  controllers: [UsersController],
  providers: [UsersService, MixpanelService],
  exports: [UsersService],
})
export class UsersModule {}
