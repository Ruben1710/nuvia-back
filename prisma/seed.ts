import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

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
 * Основная функция seeding
 */
export async function seed(): Promise<void> {
  try {
    console.log('🌱 Начало seeding...');

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
    console.error('❌ Ошибка при seeding:', error);
    throw error;
  }
}

/**
 * Безопасный запуск seed с проверкой флага
 */
export async function safeSeed(): Promise<void> {
  // В production проверяем флаг файла, чтобы не запускать повторно
  if (process.env.NODE_ENV === 'production' && isSeeded()) {
    console.log('ℹ️ Seed уже был выполнен ранее. Пропускаем...');
    return;
  }

  try {
    await seed();
  } catch (error) {
    console.error('❌ Ошибка при safe seed:', error);
    // В production не падаем, просто логируем ошибку
    if (process.env.NODE_ENV !== 'production') {
      throw error;
    }
  } finally {
    // Не отключаем Prisma, так как он может использоваться приложением
    // await prisma.$disconnect();
  }
}

async function main() {
  await seed();
  await prisma.$disconnect();
}

// Запуск только если файл вызван напрямую (не при импорте)
if (require.main === module) {
  main()
    .catch((e) => {
      console.error('❌ Ошибка при seeding:', e);
      process.exit(1);
    });
}

export default seed;
