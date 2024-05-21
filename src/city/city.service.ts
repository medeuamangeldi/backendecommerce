import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Injectable()
export class CityService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCityDto) {
    try {
      return await this.prisma.city.create({
        data,
      });
    } catch (error) {
      console.error('Error creating city:', error);
      throw new InternalServerErrorException('Failed to create city');
    }
  }

  async findAll() {
    try {
      return await this.prisma.city.findMany();
    } catch (error) {
      console.error('Error finding all cities:', error);
      throw new InternalServerErrorException('Failed to find all cities');
    }
  }

  async findOne(id: number) {
    const city = await this.prisma.city.findUnique({
      where: { id },
    });
    if (!city) {
      throw new NotFoundException('City not found');
    }
    return city;
  }

  async addPickupUrls(id: number, pickupUrls: string[]) {
    try {
      const city = await this.prisma.city.findUnique({ where: { id } });
      if (!city) {
        throw new NotFoundException('City not found');
      }
      const updatedPickupUrls = [...city.pickupUrls, ...pickupUrls];
      return await this.prisma.city.update({
        where: { id },
        data: { pickupUrls: updatedPickupUrls },
      });
    } catch (error) {
      console.error('Error adding pickup URLs:', error);
      throw new InternalServerErrorException('Failed to add pickup URLs');
    }
  }

  async removePickupUrls(id: number, pickupUrls: string[]) {
    try {
      const city = await this.prisma.city.findUnique({ where: { id } });
      if (!city) {
        throw new NotFoundException('City not found');
      }
      const updatedPickupUrls = city.pickupUrls.filter(url => !pickupUrls.includes(url));
      return await this.prisma.city.update({
        where: { id },
        data: { pickupUrls: updatedPickupUrls },
      });
    } catch (error) {
      console.error('Error removing pickup URLs:', error);
      throw new InternalServerErrorException('Failed to remove pickup URLs');
    }
  }

  async update(id: number, data: UpdateCityDto) {
    try {
      return await this.prisma.city.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error('Error updating city:', error);
      throw new InternalServerErrorException('Failed to update city');
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.city.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error deleting city:', error);
      throw new NotFoundException('City not found');
    }
  }
}
