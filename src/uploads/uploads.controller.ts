import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';

@ApiTags('Uploads')
@Controller('upload')
@UseGuards(JwtAuthGuard, AdminGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Загрузить один файл на S3 (только для админов)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Файл успешно загружен', schema: { type: 'object', properties: { url: { type: 'string' } } } })
  @ApiResponse({ status: 400, description: 'Ошибка при загрузке файла' })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Файл не предоставлен');
    }
    const url = await this.uploadsService.uploadFile(file);
    return { url };
  }

  @Post('multiple')
  @ApiBearerAuth()
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiOperation({ summary: 'Загрузить несколько файлов на S3 (только для админов)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Файлы успешно загружены', schema: { type: 'object', properties: { urls: { type: 'array', items: { type: 'string' } } } } })
  @ApiResponse({ status: 400, description: 'Ошибка при загрузке файлов' })
  async uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Файлы не предоставлены');
    }
    const urls = await this.uploadsService.uploadMultipleFiles(files);
    return { urls };
  }
}

