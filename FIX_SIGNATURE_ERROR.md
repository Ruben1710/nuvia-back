# Исправление ошибки "SignatureDoesNotMatch" для R2

## Проблема

Ошибка `SignatureDoesNotMatch` означает, что подпись запроса не совпадает. Это может быть из-за:

1. **Неправильный Secret Access Key**
2. **Неправильный Access Key ID**
3. **Пробелы или лишние символы в credentials**
4. **Неправильный регион**

## Решение

### Шаг 1: Проверьте credentials в Cloudflare

1. Зайдите в Cloudflare Dashboard
2. R2 → Manage R2 API Tokens
3. **Удалите старый токен** (если есть сомнения)
4. Создайте **новый токен**:
   - Permissions: **Object Read & Write**
   - TTL: оставьте пустым (бессрочный)
5. **Скопируйте оба ключа сразу** (они показываются только один раз!)

### Шаг 2: Проверьте .env файл

Убедитесь, что в `.env` файле:

```env
# Cloudflare R2
AWS_ACCESS_KEY_ID=ваш-access-key-id-32-символа
AWS_SECRET_ACCESS_KEY=ваш-secret-access-key-64-символа
AWS_REGION=auto
AWS_S3_BUCKET_NAME=nuvia-uploads
AWS_S3_ENDPOINT=https://7c4a953fdb9ae73b3d0d97a92065be9d.r2.cloudflarestorage.com
R2_PUBLIC_DOMAIN=https://pub-1234567890abcdef.r2.dev
```

**Важно:**
- ✅ **НЕТ кавычек** вокруг значений (или кавычки без пробелов внутри)
- ✅ **НЕТ пробелов** в начале или конце
- ✅ Access Key ID = **ровно 32 символа**
- ✅ Secret Access Key = **64+ символов**
- ✅ AWS_REGION = `auto` (для R2)

### Шаг 3: Проверьте формат .env

**❌ Неправильно:**
```env
AWS_ACCESS_KEY_ID="ключ с пробелами "
AWS_SECRET_ACCESS_KEY="секрет с пробелами "
AWS_REGION="us-east-1"
```

**✅ Правильно:**
```env
AWS_ACCESS_KEY_ID=ключбезпробелов
AWS_SECRET_ACCESS_KEY=секретбезпробелов
AWS_REGION=auto
```

### Шаг 4: Перезапустите backend

```bash
cd nuvia-back
# Остановите (Ctrl+C)
npm run start:dev
```

### Шаг 5: Проверьте логи

При запуске вы должны увидеть:
- ✅ Если все правильно - никаких ошибок о длине ключей
- ❌ Если есть проблема - увидите детальную информацию

## Частые ошибки

### Ошибка 1: Лишние пробелы
```env
# ❌ Неправильно
AWS_ACCESS_KEY_ID=ключ 
AWS_SECRET_ACCESS_KEY=секрет 

# ✅ Правильно
AWS_ACCESS_KEY_ID=ключ
AWS_SECRET_ACCESS_KEY=секрет
```

### Ошибка 2: Кавычки с пробелами
```env
# ❌ Неправильно
AWS_ACCESS_KEY_ID="ключ "
AWS_SECRET_ACCESS_KEY="секрет "

# ✅ Правильно (без кавычек)
AWS_ACCESS_KEY_ID=ключ
AWS_SECRET_ACCESS_KEY=секрет

# ✅ Или с кавычками (без пробелов внутри)
AWS_ACCESS_KEY_ID="ключ"
AWS_SECRET_ACCESS_KEY="секрет"
```

### Ошибка 3: Неправильный регион
```env
# ❌ Неправильно для R2
AWS_REGION=us-east-1

# ✅ Правильно для R2
AWS_REGION=auto
```

## Проверка credentials

После настройки проверьте:

1. Access Key ID должен быть **32 символа**
2. Secret Access Key должен быть **64+ символов**
3. Оба ключа должны быть **без пробелов**

Если проблема сохраняется:
1. **Пересоздайте токен** в Cloudflare
2. **Скопируйте ключи заново** (очень аккуратно, без пробелов)
3. **Перезапустите backend**

