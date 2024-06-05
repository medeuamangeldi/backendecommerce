import { Module } from '@nestjs/common';
import { GlobalConfigService } from './globalConfig.service';
import { GlobalConfigController } from './globalConfig.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MinioService } from 'src/minio/minio.service';

@Module({
  imports: [PrismaModule],
  providers: [GlobalConfigService, MinioService],
  controllers: [GlobalConfigController],
  exports: [GlobalConfigService],
})
export class GlobalConfigModule {}
