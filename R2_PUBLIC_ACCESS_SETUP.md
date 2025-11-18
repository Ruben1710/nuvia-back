# Настройка Public Access для R2

## Проблема

Файлы загружаются в R2, но не отображаются на фронтенде (ошибка 400). Это происходит потому, что:
- **S3 API endpoint** (`https://7c4a953fdb9ae73b3d0d97a92065be9d.r2.cloudflarestorage.com`) - это для API запросов, **НЕ для публичного доступа**
- Без Public Access файлы недоступны публично через браузер

## Решение

### Вариант 1: Public Development URL (для разработки)

1. **Включите Public Access:**
   - Cloudflare Dashboard → R2 → ваш bucket → Settings
   - Найдите "Public Development URL"
   - Нажмите "Enable" или "Create"

2. **Скопируйте Public Development URL:**
   - После включения появится URL вида: `https://pub-<random-id>.r2.dev`
   - Скопируйте этот URL

3. **Добавьте в .env:**
   ```env
   R2_PUBLIC_DOMAIN=https://pub-1234567890abcdef.r2.dev
   ```

4. **Перезапустите backend**

### Вариант 2: Custom Domain (для продакшна)

1. **В Cloudflare Dashboard:**
   - R2 → ваш bucket → Settings → Custom Domains
   - Нажмите "+ Add"
   - Введите ваш домен (например, `cdn.yourdomain.com`)

2. **Настройте DNS:**
   - Следуйте инструкциям Cloudflare
   - Добавьте CNAME запись

3. **Добавьте в .env:**
   ```env
   R2_PUBLIC_DOMAIN=https://cdn.yourdomain.com
   ```

## Важно!

**НЕ используйте S3 API endpoint для публичного доступа:**
```env
# ❌ НЕПРАВИЛЬНО (это для API, не для публичного доступа)
R2_PUBLIC_DOMAIN=https://7c4a953fdb9ae73b3d0d97a92065be9d.r2.cloudflarestorage.com

# ✅ ПРАВИЛЬНО (Public Development URL)
R2_PUBLIC_DOMAIN=https://pub-1234567890abcdef.r2.dev
```

## Правильный .env

```env
# Cloudflare R2 - API credentials (для загрузки)
AWS_ACCESS_KEY_ID=ваш-ключ
AWS_SECRET_ACCESS_KEY=ваш-секрет
AWS_REGION=auto
AWS_S3_BUCKET_NAME=nuvia-uploads
AWS_S3_ENDPOINT=https://7c4a953fdb9ae73b3d0d97a92065be9d.r2.cloudflarestorage.com

# Cloudflare R2 - Public URL (для доступа к файлам)
R2_PUBLIC_DOMAIN=https://pub-1234567890abcdef.r2.dev
```

## Разница между endpoint и public domain

- **AWS_S3_ENDPOINT** - используется для API запросов (загрузка файлов через SDK)
- **R2_PUBLIC_DOMAIN** - используется для публичного доступа к файлам (отображение в браузере)

Оба нужны, но для разных целей!

