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
        inStockCount: true,
        weightInKg: true,
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

  async getModels(
    deal: boolean,
    all: boolean,
    categoryId: string,
    productId: string,
    search: string,
    limit: number,
    skip: number,
  ) {
    let models: any;
    if (search) {
      models = await this.prisma.model.findMany({
        where: {
          name: { contains: search },
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
          product: {
            select: {
              id: true,
              nameKz: true,
              nameEn: true,
              nameRu: true,
              category: {
                select: {
                  id: true,
                  nameKz: true,
                  nameEn: true,
                  nameRu: true,
                },
              },
            },
          },
          inStockCount: true,
          weightInKg: true,
        },
        orderBy: { createdAt: 'desc' },
        take: +limit,
        skip: +skip,
      });
      return models;
    }
    if (all) {
      if (categoryId) {
        models = await this.getModelsByCategoryId(+categoryId);
      } else if (productId) {
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
            product: {
              select: {
                id: true,
                nameKz: true,
                nameEn: true,
                nameRu: true,
                category: {
                  select: {
                    id: true,
                    nameKz: true,
                    nameEn: true,
                    nameRu: true,
                  },
                },
              },
            },
            inStockCount: true,
            weightInKg: true,
          },
          orderBy: { createdAt: 'desc' },
          take: +limit,
          skip: +skip,
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
          product: {
            select: {
              id: true,
              nameKz: true,
              nameEn: true,
              nameRu: true,
              category: {
                select: {
                  id: true,
                  nameKz: true,
                  nameEn: true,
                  nameRu: true,
                },
              },
            },
          },
          inStockCount: true,
          weightInKg: true,
        },
        orderBy: { createdAt: 'desc' },
        take: +limit,
        skip: +skip,
      });
    }
    return models;
  }
  async getModelsByCategoryId(categoryId: number) {
    const models = await this.prisma.model.findMany({
      where: {
        product: {
          categoryId,
        },
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
        product: {
          select: {
            id: true,
            nameKz: true,
            nameEn: true,
            nameRu: true,
            category: {
              select: {
                id: true,
                nameKz: true,
                nameEn: true,
                nameRu: true,
              },
            },
          },
        },
        inStockCount: true,
        weightInKg: true,
      },
    });
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
        product: {
          select: {
            id: true,
            nameKz: true,
            nameEn: true,
            nameRu: true,
            category: {
              select: {
                id: true,
                nameKz: true,
                nameEn: true,
                nameRu: true,
              },
            },
          },
        },
        inStockCount: true,
        weightInKg: true,
      },
    });
    return models;
  }

  async decrementStockCount(modelId: number, count: number) {
    try {
      return await this.prisma.model.update({
        where: { id: modelId },
        data: {
          inStockCount: {
            decrement: count,
          },
        },
      });
    } catch (error) {
      throw new HttpException('error', 404, { cause: new Error('Error') });
    }
  }

  async incrementStockCount(modelId: number, count: number) {
    try {
      return await this.prisma.model.update({
        where: { id: modelId },
        data: {
          inStockCount: {
            increment: count,
          },
        },
      });
    } catch (error) {
      throw new HttpException('error', 404, { cause: new Error('Error') });
    }
  }

  async addPhotoUrl(modelId: number, photoUrl: string) {
    try {
      return await this.prisma.model.update({
        where: { id: modelId },
        data: {
          photoUrls: {
            push: photoUrl,
          },
        },
      });
    } catch (error) {
      throw new HttpException('error', 404, { cause: new Error('Error') });
    }
  }

  async deletePhotoUrl(modelId: number, photoUrl: string) {
    try {
      const model = await this.prisma.model.findUnique({
        where: { id: modelId },
        select: {
          photoUrls: true,
        },
      });
      const oldPhotoUrls = model.photoUrls;
      return await this.prisma.model.update({
        where: { id: modelId },
        data: {
          photoUrls: {
            set: oldPhotoUrls.filter((url) => url !== photoUrl),
          },
        },
      });
    } catch (error) {
      throw new HttpException('error', 404, { cause: new Error('Error') });
    }
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
