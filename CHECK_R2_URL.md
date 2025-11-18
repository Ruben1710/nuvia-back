# Проверка URL для R2

## Проблема

Файлы загружаются, но не отображаются на фронтенде. Это может быть из-за неправильного формирования публичного URL.

## Решение

### 1. Проверьте логи backend

При загрузке файла вы должны увидеть в логах backend:
```
✅ Файл загружен. URL: https://...
```

Скопируйте этот URL и проверьте в браузере - открывается ли он.

### 2. Настройте R2_PUBLIC_DOMAIN

В `.env` файле должен быть установлен `R2_PUBLIC_DOMAIN`:

```env
R2_PUBLIC_DOMAIN=https://pub-1234567890abcdef.r2.dev
```

**Как найти R2_PUBLIC_DOMAIN:**

1. Зайдите в Cloudflare Dashboard
2. R2 → Ваш bucket → Settings → Public Access
3. Там будет указан публичный URL (например, `https://pub-1234567890abcdef.r2.dev`)
4. Скопируйте этот URL в `.env`

### 3. Проверьте публичный доступ

Убедитесь, что в настройках bucket включен "Public Access":
- R2 → Ваш bucket → Settings → Public Access → Enable

### 4. Формат URL

Правильный формат URL для R2:
```
https://pub-<random-id>.r2.dev/<имя-файла>
```

**НЕ используйте:**
```
https://<account-id>.r2.cloudflarestorage.com/<bucket>/<файл>  ❌
```

Этот URL не работает для публичного доступа.

### 5. Проверьте в браузере

После загрузки файла:
1. Откройте консоль браузера (F12)
2. Найдите URL в логах
3. Скопируйте URL и откройте в новой вкладке
4. Если изображение не открывается - проблема в настройках R2

### 6. Альтернатива: Custom Domain

Если R2.dev домен не работает, настройте Custom Domain:
1. В настройках bucket → Public Access → Add Custom Domain
2. Настройте DNS согласно инструкциям Cloudflare
3. Используйте этот домен в `R2_PUBLIC_DOMAIN`

## Пример правильного .env

```env
AWS_ACCESS_KEY_ID=ваш-ключ
AWS_SECRET_ACCESS_KEY=ваш-секрет
AWS_REGION=auto
AWS_S3_BUCKET_NAME=nuvia-uploads
AWS_S3_ENDPOINT=https://7c4a953fdb9ae73b3d0d97a92065be9d.r2.cloudflarestorage.com
R2_PUBLIC_DOMAIN=https://pub-1234567890abcdef.r2.dev
```

**Важно:** `R2_PUBLIC_DOMAIN` должен быть публичным URL из настроек bucket, а не endpoint!

