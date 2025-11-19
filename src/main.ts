import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

const SEEDED_FLAG_FILE = path.join(process.cwd(), '.seeded');

/**
 * Проверяет, был ли уже выполнен seed
 */
function isSeeded(): boolean {
  try {
    return fs.existsSync(SEEDED_FLAG_FILE);
  } catch {
    return false;
  }
}

/**
 * Помечает, что seed был выполнен
 */
function markAsSeeded(): void {
  try {
    fs.writeFileSync(SEEDED_FLAG_FILE, new Date().toISOString());
  } catch (error) {
    console.warn('⚠️ Не удалось создать файл .seeded:', error);
  }
}

/**
 * Безопасный seed администратора
 */
async function safeSeedAdmin(prisma: PrismaService): Promise<void> {
  // В production проверяем флаг файла, чтобы не запускать повторно
  if (process.env.NODE_ENV === 'production' && isSeeded()) {
    console.log('ℹ️ Seed уже был выполнен ранее. Пропускаем...');
    return;
  }

  try {
    console.log('🌱 Проверка и создание администратора...');

    // Проверяем количество пользователей в таблице
    const userCount = await prisma.user.count();

    if (userCount === 0) {
      // Если таблица users пустая, создаем администратора
      const adminEmail = 'admin@nuvia.com';
      const adminPassword = 'admin123';

      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          role: 'admin',
        },
      });

      console.log('✅ Admin user created');
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Password:', adminPassword);
      markAsSeeded();
    } else {
      // Проверяем, существует ли админ
      const adminEmail = 'admin@nuvia.com';
      const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
      });

      if (existingAdmin) {
        console.log('✅ Admin exists');
        markAsSeeded();
      } else {
        console.log('ℹ️ Users exist, but admin not found. Skipping admin creation.');
      }
    }

    console.log('✨ Seeding завершен!');
  } catch (error) {
    console.error('❌ Ошибка при safe seed:', error);
    // В production не падаем, просто логируем ошибку
    if (process.env.NODE_ENV !== 'production') {
      throw error;
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Автоматический seed в production перед запуском приложения
  if (process.env.NODE_ENV === 'production') {
    try {
      const prismaService = app.get(PrismaService);
      await safeSeedAdmin(prismaService);
    } catch (error) {
      console.error('⚠️ Ошибка при авто-сидинге (продолжаем запуск):', error);
      // Не падаем, просто логируем ошибку и продолжаем
    }
  }

  // CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Nuvia API')
    .setDescription('API для интернет-магазина Nuvia')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Application is running on port: ${port}`);
  console.log(`📚 Swagger documentation available at /docs`);
}

bootstrap();

