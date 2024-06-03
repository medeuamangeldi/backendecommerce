import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';

@Injectable()
export class ModelService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateModelDto) {
    try {
      return await this.prisma.model.create({ data });
    } catch (error) {
      throw new HttpException('error', 404, { cause: new Error('Error') });
    }
  }
  async update(id: number, data: UpdateModelDto) {
    try {
      return await this.prisma.model.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new HttpException('error', 404, { cause: new Error('Error') });
    }
  }

  async getModelById(id: number) {
    const model = await this.prisma.model.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        price: true,
        deal: true,
        photoUrls: true,
        descriptionKz: true,
        descriptionEn: true,
        descriptionRu: true,
        detailedDescriptionEn: true,
        detailedDescriptionKz: true,
        detailedDescriptionRu: true,
        product: {
          select: {
            id: true,
            nameKz: true,
            nameEn: true,
            nameRu: true,
          },
        },
      },
    });

    if (!model) {
      throw new NotFoundException('Model not found');
    }
    return model;
  }

  async getModels(deal: boolean, all: boolean, productId: string) {
    let models: any;
    if (all) {
      if (productId) {
        models = await this.getModelsByProductId(+productId);
      } else {
        models = await this.prisma.model.findMany({
          select: {
            id: true,
            name: true,
            price: true,
            deal: true,
            photoUrls: true,
            descriptionKz: true,
            descriptionEn: true,
            descriptionRu: true,
            detailedDescriptionEn: true,
            detailedDescriptionKz: true,
            detailedDescriptionRu: true,
          },
        });
      }
    } else {
      models = await this.prisma.model.findMany({
        where: {
          deal,
        },
        select: {
          id: true,
          name: true,
          price: true,
          deal: true,
          photoUrls: true,
          descriptionKz: true,
          descriptionEn: true,
          descriptionRu: true,
          detailedDescriptionEn: true,
          detailedDescriptionKz: true,
          detailedDescriptionRu: true,
        },
      });
    }
    return models;
  }

  async getModelsByProductId(productId: number) {
    const models = await this.prisma.model.findMany({
      where: {
        productId,
      },
      select: {
        id: true,
        name: true,
        price: true,
        deal: true,
        photoUrls: true,
        descriptionKz: true,
        descriptionEn: true,
        descriptionRu: true,
        detailedDescriptionEn: true,
        detailedDescriptionKz: true,
        detailedDescriptionRu: true,
      },
    });
    return models;
  }

  async remove(id: number) {
    try {
      return await this.prisma.model.delete({
        where: { id },
      });
    } catch (error) {
      throw new HttpException('error', 404, { cause: new Error('Error') });
    }
  }
}
