# Настройка Cloudflare R2 для загрузки файлов

## Шаги настройки

### 1. Создайте R2 Bucket в Cloudflare

1. Войдите в Cloudflare Dashboard
2. Перейдите в R2 → Create bucket
3. Создайте bucket с именем (например, `nuvia-uploads`)
4. Запомните имя bucket

### 2. Получите Access Keys

1. В R2 Dashboard перейдите в "Manage R2 API Tokens"
2. Нажмите "Create API token"
3. Выберите:
   - Permissions: Object Read & Write
   - TTL: по желанию (или оставьте пустым)
4. Сохраните:
   - Access Key ID
   - Secret Access Key

### 3. Настройте публичный доступ (опционально)

Для публичного доступа к файлам есть два варианта:

#### Вариант A: Использовать Custom Domain (рекомендуется)

1. В настройках bucket перейдите в "Public Access"
2. Добавьте Custom Domain (например, `cdn.yourdomain.com`)
3. Настройте DNS записи согласно инструкциям Cloudflare
4. Используйте этот домен в `R2_PUBLIC_DOMAIN`

#### Вариант B: Использовать R2.dev домен

1. В настройках bucket включите "Public Access"
2. Cloudflare автоматически создаст публичный URL вида: `https://pub-<random-id>.r2.dev`
3. Используйте этот URL в `R2_PUBLIC_DOMAIN`

### 4. Настройте .env файл

Добавьте следующие переменные в `.env`:

```env
# Cloudflare R2
AWS_ACCESS_KEY_ID="your-r2-access-key-id"
AWS_SECRET_ACCESS_KEY="your-r2-secret-access-key"
AWS_REGION="auto"
AWS_S3_BUCKET_NAME="nuvia-uploads"
AWS_S3_ENDPOINT="https://<account-id>.r2.cloudflarestorage.com"
R2_PUBLIC_DOMAIN="https://pub-<random-id>.r2.dev"  # или ваш custom domain
```

**Где найти account-id:**
- В URL Cloudflare Dashboard: `https://dash.cloudflare.com/<account-id>/r2`
- Или в настройках R2 API

**Пример для R2.dev:**
```env
AWS_S3_ENDPOINT="https://abc123def456.r2.cloudflarestorage.com"
R2_PUBLIC_DOMAIN="https://pub-1234567890abcdef.r2.dev"
```

**Пример для Custom Domain:**
```env
AWS_S3_ENDPOINT="https://abc123def456.r2.cloudflarestorage.com"
R2_PUBLIC_DOMAIN="https://cdn.yourdomain.com"
```

### 5. Перезапустите backend

```bash
# Остановите текущий процесс (Ctrl+C)
# Затем запустите снова
npm run start:dev
```

## Проверка

После настройки попробуйте загрузить файл через админ-панель. Если все настроено правильно, файл должен загрузиться и вернуться публичный URL.

## Troubleshooting

### Ошибка "Access Denied"
- Проверьте правильность Access Key ID и Secret Access Key
- Убедитесь, что у токена есть права Object Read & Write

### Ошибка "Bucket not found"
- Проверьте правильность `AWS_S3_BUCKET_NAME`
- Убедитесь, что bucket существует в вашем аккаунте

### Файлы загружаются, но URL не работает
- Проверьте, что `R2_PUBLIC_DOMAIN` правильный
- Убедитесь, что Public Access включен для bucket
- Если используете custom domain, проверьте DNS настройки

### Ошибка подключения
- Проверьте правильность `AWS_S3_ENDPOINT`
- Убедитесь, что формат: `https://<account-id>.r2.cloudflarestorage.com`

