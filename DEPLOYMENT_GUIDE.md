# 🚀 Руководство по деплою на Vercel

## Проблема с SQLite на Vercel

SQLite **НЕ работает** на Vercel по следующим причинам:
- Vercel использует read-only файловую систему
- SQLite файлы создаются в `/tmp` и удаляются после каждого запроса
- Нет постоянного хранения данных

## Решение: Автоматическое переключение между Supabase и SQLite

Проект настроен для автоматического переключения:
- **Локальная разработка**: SQLite (быстро, без интернета)
- **Продакшен (Vercel)**: Supabase (надежно, с постоянным хранением)

## Шаги для деплоя на Vercel

### 1. Подготовка Supabase

Убедитесь, что у вас настроен Supabase проект:

```bash
# Проверьте, что переменные окружения настроены
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

### 2. Настройка переменных окружения в Vercel

В панели управления Vercel добавьте следующие переменные:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
NODE_ENV=production
VERCEL=1
```

### 3. Деплой проекта

```bash
# Установите Vercel CLI
npm i -g vercel

# Войдите в аккаунт Vercel
vercel login

# Деплой
vercel --prod
```

### 4. Проверка работы

После деплоя проверьте:

1. **Консоль браузера**: Должны быть логи с `☁️ Using Supabase`
2. **Сетка продуктов**: Должна отображать товары из Supabase
3. **Фильтрация**: Должна работать корректно

## Альтернативные решения для продакшена

### 1. PlanetScale (MySQL)
```bash
npm install @planetscale/database
```

### 2. Neon (PostgreSQL)
```bash
npm install @neondatabase/serverless
```

### 3. Turso (SQLite в облаке)
```bash
npm install @libsql/client
```

## Локальная разработка

Для локальной разработки SQLite будет работать как обычно:

```bash
npm run dev
```

В консоли вы увидите:
```
💾 Using SQLite
✅ SQLite returned 15 products
```

## Отладка проблем

### Проблема: Данные не загружаются на Vercel

**Решение:**
1. Проверьте переменные окружения в Vercel
2. Убедитесь, что Supabase проект активен
3. Проверьте CORS настройки в Supabase

### Проблема: Медленная загрузка

**Решение:**
1. Включите кэширование в Supabase
2. Используйте CDN для статических файлов
3. Оптимизируйте запросы к базе данных

### Проблема: Ошибки CORS

**Решение:**
В Supabase Dashboard → Settings → API:
1. Добавьте домен Vercel в CORS origins
2. Убедитесь, что анонимный ключ правильный

## Мониторинг

### Логи Vercel
```bash
vercel logs --follow
```

### Логи Supabase
В Supabase Dashboard → Logs

### Метрики производительности
- Vercel Analytics
- Supabase Dashboard → Usage

## Резервное копирование

### Экспорт данных из Supabase
```sql
-- Экспорт продуктов
SELECT * FROM products;

-- Экспорт категорий  
SELECT * FROM categories;
```

### Импорт в локальную SQLite
```bash
npm run init-sqlite
```

## Заключение

Проект настроен для работы в двух режимах:
- **Разработка**: Быстрый SQLite
- **Продакшен**: Надежный Supabase

Это обеспечивает лучший опыт разработки и надежность в продакшене. 