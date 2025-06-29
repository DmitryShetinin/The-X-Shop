# 🗄️ Руководство по SQLite базе данных - The X Shop

## 📋 Ответы на ваши вопросы

### 1. Как создать файл базы данных?

#### Способ 1: Автоматическое создание (рекомендуется)
```bash
node scripts/create-sqlite-db.cjs
```

#### Способ 2: Через npm скрипт
```bash
npm run create-db
```

#### Что происходит при создании:
- ✅ Создается файл `database.db` в корне проекта
- ✅ Создаются таблицы `products` и `categories`
- ✅ Добавляются тестовые данные (3 продукта, 3 категории)
- ✅ Настраиваются внешние ключи и индексы

### 2. Где создается файл базы данных?

#### 📁 Расположение файла:
```
The X Shop/
├── database.db          ← Файл базы данных здесь
├── src/
├── scripts/
├── package.json
└── ...
```

#### 🔍 Как проверить:
```bash
# В корне проекта
dir database.db

# Или через PowerShell
Get-ChildItem database.db
```

## 🗂️ Структура базы данных

### Таблица `categories`
```sql
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image TEXT DEFAULT '/placeholder.svg',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Таблица `products`
```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  discount_price REAL,
  category TEXT NOT NULL,
  image_url TEXT DEFAULT '/placeholder.svg',
  additional_images TEXT DEFAULT '[]',
  rating REAL DEFAULT 4.7,
  in_stock BOOLEAN DEFAULT 1,
  colors TEXT DEFAULT '[]',
  sizes TEXT DEFAULT '[]',
  material TEXT,
  country_of_origin TEXT,
  specifications TEXT DEFAULT '{}',
  is_new BOOLEAN DEFAULT 0,
  is_bestseller BOOLEAN DEFAULT 0,
  article_number TEXT,
  barcode TEXT,
  ozon_url TEXT,
  wildberries_url TEXT,
  avito_url TEXT,
  archived BOOLEAN DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  color_variants TEXT DEFAULT '[]',
  video_url TEXT,
  video_type TEXT,
  model_name TEXT,
  related_color_products TEXT DEFAULT '[]',
  is_color_variant BOOLEAN DEFAULT 0,
  parent_product_id TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category) REFERENCES categories (name)
);
```

## 🚀 Как использовать

### 1. Создание базы данных
```bash
# Создаем базу данных с тестовыми данными
node scripts/create-sqlite-db.cjs
```

### 2. Запуск проекта
```bash
# Запускаем проект
npm run dev
```

### 3. Проверка работы
Откройте консоль браузера и проверьте:
```javascript
// Проверка загрузки базы данных
console.log('SQLite DB loaded:', window.sqliteDB);

// Получение продуктов
const products = await window.sqliteDB.getProducts();
console.log('Products:', products);

// Получение категорий
const categories = await window.sqliteDB.getCategory();
console.log('Categories:', categories);
```

## 🔧 Управление базой данных

### Просмотр содержимого
```bash
# Установка SQLite CLI (если нужно)
# Windows: скачайте с https://www.sqlite.org/download.html

# Просмотр таблиц
sqlite3 database.db ".tables"

# Просмотр продуктов
sqlite3 database.db "SELECT id, title, price FROM products;"

# Просмотр категорий
sqlite3 database.db "SELECT * FROM categories;"
```

### Добавление новых данных
```bash
# Добавление нового продукта
sqlite3 database.db "
INSERT INTO products (id, title, description, price, category, image_url)
VALUES ('new-1', 'Новый продукт', 'Описание', 5000, 'Смарт-часы', '/image.jpg');
"
```

## 📊 Тестовые данные

### Категории:
1. **Смарт-часы** - Умные часы и фитнес-браслеты
2. **Планшеты** - Планшеты и планшетные компьютеры  
3. **Проекторы** - Домашние и портативные проекторы

### Продукты:
1. **Смарт-часы DT 8 Mini** - 3500₽
2. **Планшет Android 10"** - 12000₽
3. **Проектор Full HD** - 8000₽

## 🔄 Fallback механизм

Если настоящая SQLite база данных недоступна:

1. **Автоматический переход** на моковые данные
2. **Загрузка из** `src/data/mock-data.json`
3. **Создание тестовых данных** в памяти

### Логи в консоли:
```
✅ Настоящая SQLite база данных загружена успешно
```
или
```
❌ Ошибка загрузки SQLite базы данных
🔄 Переключаемся на моковые данные...
✅ Моковые данные загружены
```

## 🛠️ Разработка

### Добавление новых полей:
1. **Обновите схему** в `scripts/create-sqlite-db.cjs`
2. **Пересоздайте базу данных**
3. **Обновите TypeScript типы**

### Миграции:
```bash
# Создание новой версии базы данных
node scripts/create-sqlite-db.cjs

# Или удалите старую и создайте новую
rm database.db
node scripts/create-sqlite-db.cjs
```

## 📝 Примечания

### Размер файла:
- **Пустая база данных:** ~50KB
- **С тестовыми данными:** ~53KB
- **Может расти** при добавлении продуктов

### Производительность:
- **Быстрая загрузка** - файл загружается один раз
- **Кэширование** - данные кэшируются в браузере
- **Fallback** - работает даже без файла

### Безопасность:
- **Только чтение** - база данных не изменяется в браузере
- **Локальное хранение** - данные не отправляются на сервер
- **Изоляция** - каждый пользователь видит свои данные

## ✅ Статус

- **Файл базы данных:** ✅ Создан
- **Тестовые данные:** ✅ Добавлены
- **API функции:** ✅ Работают
- **Fallback механизм:** ✅ Настроен
- **Документация:** ✅ Готова

База данных SQLite готова к использованию! 🎉 