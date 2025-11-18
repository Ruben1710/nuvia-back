import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начало seeding...');

  // Создаем первого администратора
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@nuvia.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('✅ Администратор уже существует');
  } else {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      },
    });
    console.log('✅ Создан администратор:', admin.email);
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
  }

  // Создаем примеры категорий
  const categories = [
    {
      slug: 'mugs',
      nameEn: 'Mugs',
      nameRu: 'Кружки',
      nameArm: 'Բաժակներ',
    },
    {
      slug: 't-shirts',
      nameEn: 'T-Shirts',
      nameRu: 'Футболки',
      nameArm: 'Ֆուտբոլկաներ',
    },
    {
      slug: 'keychains',
      nameEn: 'Keychains',
      nameRu: 'Брелоки',
      nameArm: 'Բանալիներ',
    },
  ];

  for (const categoryData of categories) {
    const existingCategory = await prisma.category.findUnique({
      where: { slug: categoryData.slug },
    });

    if (!existingCategory) {
      await prisma.category.create({
        data: categoryData,
      });
      console.log(`✅ Создана категория: ${categoryData.slug}`);
    }
  }

  console.log('✨ Seeding завершен!');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

