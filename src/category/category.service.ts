import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';


@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) {}
    async create(data: CreateCategoryDto) {
        try{
            return await this.prisma.category.create({ data });
        } catch(error) {
            throw new HttpException("error", 404, { cause: new Error("Error")});
        }
    }       
    async update(id: number, data: UpdateCategoryDto) {
        try {
            return await this.prisma.category.update({
                where: { id },
                data,
            });
        } catch (error) {
            throw new HttpException("error", 404, { cause: new Error("Error")});
        }
    }
    async findAll() {
        try {
            return await this.prisma.category.findMany();
        } catch (error) {
            throw new HttpException("error", 404, { cause: new Error("Error")});
        }
    }
    async remove(id: number) {
        try {
            return await this.prisma.category.delete({
                where: { id },
            });
        } catch (error) {
            throw new HttpException("error", 404, { cause: new Error("Error")});
        }
    }
}