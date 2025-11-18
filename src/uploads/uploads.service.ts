import { Injectable, BadRequestException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, S3_BUCKET_NAME } from '../common/config/s3.config';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadsService {
  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('Файл не предоставлен');
    }

    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${randomUUID()}.${fileExtension}`;

    try {
      const putObjectParams: any = {
        Bucket: S3_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      // ACL поддерживается только для S3, не для R2
      if (!process.env.AWS_S3_ENDPOINT) {
        putObjectParams.ACL = 'public-read';
      }

      const command = new PutObjectCommand(putObjectParams);
      await s3Client.send(command);

      // Формируем публичный URL
      let fileUrl: string;
      if (process.env.AWS_S3_ENDPOINT) {
        // Для R2 или совместимых сервисов
        // Если указан публичный домен для R2, используем его
        if (process.env.R2_PUBLIC_DOMAIN) {
          const publicDomain = process.env.R2_PUBLIC_DOMAIN.replace(/\/$/, '');
          fileUrl = `${publicDomain}/${fileName}`;
          console.log(`✅ Файл загружен. URL: ${fileUrl}`);
        } else {
          // Если R2_PUBLIC_DOMAIN не установлен, но Public Access включен
          // Можно использовать Public Development URL из настроек R2
          // Формат: https://pub-<random-id>.r2.dev/<bucket-name>/<file>
          // Но для этого нужно включить Public Access в настройках bucket
          console.error(`❌ R2_PUBLIC_DOMAIN не установлен!`);
          console.error(`   Для работы с R2 нужно:`);
          console.error(`   1. Включить Public Access в настройках bucket`);
          console.error(`   2. Скопировать Public Development URL из настроек`);
          console.error(`   3. Установить его в R2_PUBLIC_DOMAIN в .env`);
          throw new BadRequestException(
            'R2_PUBLIC_DOMAIN не установлен. Включите Public Access в настройках R2 bucket и установите R2_PUBLIC_DOMAIN в .env файле.'
          );
        }
      } else {
        // Для стандартного S3
        const region = process.env.AWS_REGION || 'us-east-1';
        fileUrl = `https://${S3_BUCKET_NAME}.s3.${region}.amazonaws.com/${fileName}`;
        console.log(`✅ Файл загружен. URL: ${fileUrl}`);
      }

      return fileUrl;
    } catch (error: any) {
      console.error('S3/R2 Upload Error:', {
        message: error.message,
        code: error.Code || error.code,
        bucket: S3_BUCKET_NAME,
        endpoint: process.env.AWS_S3_ENDPOINT,
        hasCredentials: !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY),
      });
      throw new BadRequestException(
        `Ошибка при загрузке файла: ${error.message || error.Code || 'Unknown error'}. Проверьте настройки S3/R2 в .env файле.`
      );
    }
  }

  async uploadMultipleFiles(files: Express.Multer.File[]): Promise<string[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Файлы не предоставлены');
    }

    const uploadPromises = files.map((file) => this.uploadFile(file));
    return Promise.all(uploadPromises);
  }
}

