# 🚀 Быстрый старт

## Шаг 1: Установка зависимостей

```bash
cd nuvia-back
npm install
```

## Шаг 2: Настройка окружения

Скопируйте `env.example` в `.env` и заполните переменные:

```bash
cp env.example .env
```

Обязательно настройте:
- `DATABASE_URL` - подключение к PostgreSQL
- `JWT_SECRET` - секретный ключ для JWT
- `AWS_*` - настройки S3/R2 (можно оставить пустыми для начала)

## Шаг 3: Создание базы данных

```bash
# Создайте базу данных PostgreSQL
createdb nuvia_db
# или через psql:
# psql -U postgres -c "CREATE DATABASE nuvia_db;"
```

## Шаг 4: Миграции и seed

```bash
# Генерация Prisma Client
npm run prisma:generate

# Применение миграций
npm run prisma:migrate

# Seed создаст первого админа:
# Email: admin@nuvia.com
# Password: admin123
```

## Шаг 5: Запуск

```bash
npm run start:dev
```

## Шаг 6: Проверка

- API: http://localhost:3000
- Swagger: http://localhost:3000/docs
- Вход: `POST /auth/login` с `admin@nuvia.com` / `admin123`

## 📝 Основные команды

```bash
npm run start:dev      # Разработка
npm run build          # Сборка
npm run start:prod     # Продакшн
npm run prisma:studio  # GUI для БД
npm run lint           # Проверка кода
```

## 🔑 Первый вход

После seed скрипта используйте:
- **Email:** `admin@nuvia.com`
- **Password:** `admin123`

Или настройте через переменные окружения:
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

---

**Готово! 🎉**

