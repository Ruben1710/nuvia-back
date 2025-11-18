import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsArray, IsObject, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ProductImageDto {
  @ApiProperty({ example: 'https://example.com/img1.jpg' })
  @IsString()
  url: string;

  @ApiProperty({ example: [0, 1], description: 'Индексы моделей из filters.model' })
  @IsArray()
  @IsInt({ each: true })
  modelIds: number[];
}

export class CreateProductDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  categoryId: number;

  @ApiProperty({ example: 'Custom Mug' })
  @IsString()
  nameEn: string;

  @ApiProperty({ example: 'Кружка на заказ' })
  @IsString()
  nameRu: string;

  @ApiProperty({ example: 'Պատվերով բաժակ' })
  @IsString()
  nameArm: string;

  @ApiProperty({ example: 'Beautiful custom mug', required: false })
  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @ApiProperty({ example: 'Красивая кружка на заказ', required: false })
  @IsOptional()
  @IsString()
  descriptionRu?: string;

  @ApiProperty({ example: 'Գեղեցիկ պատվերով բաժակ', required: false })
  @IsOptional()
  @IsString()
  descriptionArm?: string;

  @ApiProperty({ example: 1500 })
  @IsInt()
  @Min(0)
  price: number;

  @ApiProperty({ 
    example: [
      { url: 'https://example.com/img1.jpg', modelIds: [0, 1] },
      { url: 'https://example.com/img2.jpg', modelIds: [1] }
    ], 
    required: false,
    type: [ProductImageDto]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images?: ProductImageDto[];

  @ApiProperty({ example: 'Slider description EN', required: false })
  @IsOptional()
  @IsString()
  sliderDescriptionEn?: string;

  @ApiProperty({ example: 'Описание слайдера RU', required: false })
  @IsOptional()
  @IsString()
  sliderDescriptionRu?: string;

  @ApiProperty({ example: 'Սլայդերի նկարագրություն ARM', required: false })
  @IsOptional()
  @IsString()
  sliderDescriptionArm?: string;

  @ApiProperty({ example: { color: 'red', size: 'large' }, required: false })
  @IsOptional()
  @IsObject()
  filters?: any;
}

