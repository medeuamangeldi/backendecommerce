import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MinioService } from 'src/minio/minio.service';

@Module({
  imports: [PrismaModule],
  providers: [ProductService, MinioService],
  controllers: [ProductController],
})
export class ProductModule {}
