import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'mugs' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Mugs' })
  @IsString()
  @IsNotEmpty()
  nameEn: string;

  @ApiProperty({ example: 'Кружки' })
  @IsString()
  @IsNotEmpty()
  nameRu: string;

  @ApiProperty({ example: 'Բաժակներ' })
  @IsString()
  @IsNotEmpty()
  nameArm: string;

  @ApiProperty({ example: 'https://example.com/category-image.jpg', required: false })
  @IsOptional()
  @IsString()
  img?: string;
}

