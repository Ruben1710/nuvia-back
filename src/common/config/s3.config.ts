import { S3Client } from '@aws-sdk/client-s3';

// Валидация и очистка переменных окружения
const validateAndCleanS3Config = () => {
  // Очищаем от пробелов и переносов строк
  if (process.env.AWS_ACCESS_KEY_ID) {
    process.env.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID.trim();
  }
  if (process.env.AWS_SECRET_ACCESS_KEY) {
    process.env.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY.trim();
  }
  if (process.env.AWS_S3_BUCKET_NAME) {
    process.env.AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME.trim();
  }
  if (process.env.AWS_S3_ENDPOINT) {
    process.env.AWS_S3_ENDPOINT = process.env.AWS_S3_ENDPOINT.trim();
  }
  if (process.env.R2_PUBLIC_DOMAIN) {
    process.env.R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN.trim();
  }

  // Валидация
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.warn('⚠️  AWS_ACCESS_KEY_ID или AWS_SECRET_ACCESS_KEY не установлены. Загрузка файлов может не работать.');
  } else {
    // Проверка длины Access Key ID (должен быть 32 символа для R2)
    const accessKeyLength = process.env.AWS_ACCESS_KEY_ID.length;
    const secretKeyLength = process.env.AWS_SECRET_ACCESS_KEY.length;
    
    if (accessKeyLength !== 32) {
      console.error(`❌ AWS_ACCESS_KEY_ID имеет неправильную длину: ${accessKeyLength} символов (должно быть 32)`);
      console.error(`   Первые 10 символов: "${process.env.AWS_ACCESS_KEY_ID.substring(0, 10)}..."`);
      console.error('   Проверьте .env файл - возможно есть лишние пробелы или символы');
    }
    
    if (secretKeyLength < 40) {
      console.error(`❌ AWS_SECRET_ACCESS_KEY слишком короткий: ${secretKeyLength} символов (должно быть 40+)`);
      console.error('   Проверьте .env файл - возможно ключ обрезан или есть лишние пробелы');
    }
    
    // Показываем информацию о конфигурации (без самих ключей)
    if (process.env.AWS_S3_ENDPOINT) {
      console.log('✅ R2 конфигурация обнаружена:');
      console.log(`   Endpoint: ${process.env.AWS_S3_ENDPOINT}`);
      console.log(`   Bucket: ${process.env.AWS_S3_BUCKET_NAME}`);
      console.log(`   Region: ${process.env.AWS_REGION || 'auto'}`);
      console.log(`   Access Key ID длина: ${accessKeyLength} символов`);
      console.log(`   Secret Key длина: ${secretKeyLength} символов`);
    }
  }
  
  if (!process.env.AWS_S3_BUCKET_NAME) {
    console.warn('⚠️  AWS_S3_BUCKET_NAME не установлен. Используется значение по умолчанию: nuvia-uploads');
  }
  if (process.env.AWS_S3_ENDPOINT && !process.env.AWS_S3_ENDPOINT.startsWith('https://')) {
    console.warn('⚠️  AWS_S3_ENDPOINT должен начинаться с https://');
  }
};

validateAndCleanS3Config();

// Конфигурация для R2 требует специальных настроек
const isR2 = !!process.env.AWS_S3_ENDPOINT;

export const s3Client = new S3Client({
  region: isR2 ? (process.env.AWS_REGION || 'auto') : (process.env.AWS_REGION || 'us-east-1'),
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  ...(isR2 && {
    endpoint: process.env.AWS_S3_ENDPOINT,
    forcePathStyle: true, // Обязательно для R2
    // Для R2 может потребоваться отключить некоторые проверки
    tls: true,
  }),
});

export const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'nuvia-uploads';
