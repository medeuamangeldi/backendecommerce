import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFaqDto } from './dto/create-faq.dto';

@Injectable()
export class FaqService {
  constructor(private prisma: PrismaService) {}

  async getOneFaq(id: number) {
    const faq = await this.prisma.faq.findUnique({
      where: { id },
    });

    if (!faq) {
      throw new Error('Faq not found');
    }

    return faq;
  }

  async getAllFaqs() {
    const faqs = await this.prisma.faq.findMany();
    return faqs;
  }

  async createFaq(data: CreateFaqDto) {
    return await this.prisma.faq.create({
      data,
    });
  }

  async updateFaq(id: number, data: CreateFaqDto) {
    const faq = await this.prisma.faq.findUnique({
      where: { id },
    });
    if (!faq) {
      throw new Error('Faq not found');
    }
    return await this.prisma.faq.update({
      where: { id },
      data,
    });
  }

  async deleteFaq(id: number) {
    const faq = await this.prisma.faq.findUnique({
      where: { id },
    });
    if (!faq) {
      throw new Error('Faq not found');
    }
    return await this.prisma.faq.delete({
      where: { id },
    });
  }
}
