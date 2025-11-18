import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';

@Injectable()
export class WorksService {
  constructor(private prisma: PrismaService) {}

  async create(createWorkDto: CreateWorkDto) {
    // Проверяем существование категории
    const category = await this.prisma.category.findUnique({
      where: { id: createWorkDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Категория с ID ${createWorkDto.categoryId} не найдена`);
    }

    return this.prisma.work.create({
      data: createWorkDto,
      include: {
        category: true,
      },
    });
  }

  async findAll() {
    return this.prisma.work.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const work = await this.prisma.work.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!work) {
      throw new NotFoundException(`Work with ID ${id} not found`);
    }

    return work;
  }

  async update(id: number, updateWorkDto: UpdateWorkDto) {
    await this.findOne(id); // Проверяем существование

    return this.prisma.work.update({
      where: { id },
      data: updateWorkDto,
      include: {
        category: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Проверяем существование

    return this.prisma.work.delete({
      where: { id },
    });
  }
}

