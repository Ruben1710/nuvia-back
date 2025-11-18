import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateWorkDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  categoryId: number;

  @ApiProperty({ example: 'Custom Mug Design' })
  @IsString()
  titleEn: string;

  @ApiProperty({ example: 'Дизайн кружки на заказ' })
  @IsString()
  titleRu: string;

  @ApiProperty({ example: 'Պատվերով բաժակի դիզայն' })
  @IsString()
  titleArm: string;

  @ApiProperty({ example: 'Beautiful custom mug design', required: false })
  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @ApiProperty({ example: 'Красивый дизайн кружки на заказ', required: false })
  @IsOptional()
  @IsString()
  descriptionRu?: string;

  @ApiProperty({ example: 'Գեղեցիկ պատվերով բաժակի դիզայն', required: false })
  @IsOptional()
  @IsString()
  descriptionArm?: string;

  @ApiProperty({ example: 'https://example.com/photo.jpg' })
  @IsString()
  photo: string;
}

