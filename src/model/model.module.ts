import { Module } from '@nestjs/common';
import { ModelService } from './model.service';
import { ModelController } from './model.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MinioService } from 'src/minio/minio.service';

@Module({
  imports: [PrismaModule],
  providers: [ModelService, MinioService],
  controllers: [ModelController],
  exports: [ModelService],
})
export class ModelModule {}
