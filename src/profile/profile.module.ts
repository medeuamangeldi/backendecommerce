import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MinioService } from 'src/minio/minio.service';

@Module({
  imports: [PrismaModule],
  providers: [ProfileService, MinioService],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}
