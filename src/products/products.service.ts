import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    // Проверяем существование категории
    const category = await this.prisma.category.findUnique({
      where: { id: createProductDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Категория с ID ${createProductDto.categoryId} не найдена`);
    }

    return this.prisma.product.create({
      data: {
        ...createProductDto,
        images: (createProductDto.images || []) as any,
        filters: (createProductDto.filters || {}) as any,
      },
      include: {
        category: true,
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Товар с ID ${id} не найден`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    // Проверяем существование товара
    await this.findOne(id);

    // Если обновляется categoryId, проверяем существование категории
    if (updateProductDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateProductDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException(`Категория с ID ${updateProductDto.categoryId} не найдена`);
      }
    }

    // Формируем объект обновления, исключая undefined значения
    const updateData: any = {};
    
    if (updateProductDto.categoryId !== undefined) {
      updateData.categoryId = updateProductDto.categoryId;
    }
    if (updateProductDto.nameEn !== undefined) {
      updateData.nameEn = updateProductDto.nameEn;
    }
    if (updateProductDto.nameRu !== undefined) {
      updateData.nameRu = updateProductDto.nameRu;
    }
    if (updateProductDto.nameArm !== undefined) {
      updateData.nameArm = updateProductDto.nameArm;
    }
    if (updateProductDto.descriptionEn !== undefined) {
      updateData.descriptionEn = updateProductDto.descriptionEn;
    }
    if (updateProductDto.descriptionRu !== undefined) {
      updateData.descriptionRu = updateProductDto.descriptionRu;
    }
    if (updateProductDto.descriptionArm !== undefined) {
      updateData.descriptionArm = updateProductDto.descriptionArm;
    }
    if (updateProductDto.price !== undefined) {
      updateData.price = updateProductDto.price;
    }
    if (updateProductDto.images !== undefined) {
      updateData.images = updateProductDto.images as any;
    }
    if (updateProductDto.sliderDescriptionEn !== undefined) {
      updateData.sliderDescriptionEn = updateProductDto.sliderDescriptionEn;
    }
    if (updateProductDto.sliderDescriptionRu !== undefined) {
      updateData.sliderDescriptionRu = updateProductDto.sliderDescriptionRu;
    }
    if (updateProductDto.sliderDescriptionArm !== undefined) {
      updateData.sliderDescriptionArm = updateProductDto.sliderDescriptionArm;
    }
    if (updateProductDto.filters !== undefined) {
      updateData.filters = updateProductDto.filters as any;
    }

    return this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.product.delete({
      where: { id },
    });
  }
}

