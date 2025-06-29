const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

async function createSQLiteDatabase() {
  try {
    console.log('🚀 Создание расширенной SQLite базы данных...');
    
    // Путь к файлу базы данных
    const dbPath = path.join(__dirname, '../database.db');
    console.log(`📁 Файл базы данных: ${dbPath}`);
    
    // Создаем новую базу данных
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Ошибка создания базы данных:', err.message);
        return;
      }
      console.log('✅ База данных создана успешно!');
    });
    
    // Включаем внешние ключи
    db.run('PRAGMA foreign_keys = ON');
    
    // Создаем таблицу категорий
    const createCategoriesTable = `
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        image TEXT DEFAULT '/placeholder.svg',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Создаем таблицу продуктов
    const createProductsTable = `
      CREATE TABLE IF NOT EXISTS products (
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
      )
    `;
    
    // Выполняем создание таблиц
    db.serialize(() => {
      // Создаем таблицу категорий
      db.run(createCategoriesTable, (err) => {
        if (err) {
          console.error('❌ Ошибка создания таблицы категорий:', err.message);
        } else {
          console.log('✅ Таблица categories создана');
        }
      });
      
      // Создаем таблицу продуктов
      db.run(createProductsTable, (err) => {
        if (err) {
          console.error('❌ Ошибка создания таблицы продуктов:', err.message);
        } else {
          console.log('✅ Таблица products создана');
        }
      });
      
      // Добавляем тестовые данные
      setTimeout(() => {
        insertTestData(db);
      }, 1000);
    });
    
  } catch (error) {
    console.error('💥 Ошибка создания базы данных:', error);
    process.exit(1);
  }
}

function insertTestData(db) {
  console.log('📝 Добавление расширенных тестовых данных...');
  
  // Расширенные категории
  const categories = [
    {
      id: '1',
      name: 'Смарт-часы',
      description: 'Умные часы и фитнес-браслеты для активного образа жизни',
      image: '/placeholder.svg'
    },
    {
      id: '2', 
      name: 'Планшеты',
      description: 'Планшеты и планшетные компьютеры для работы и развлечений',
      image: '/placeholder.svg'
    },
    {
      id: '3',
      name: 'Проекторы', 
      description: 'Домашние и портативные проекторы для кинотеатра',
      image: '/placeholder.svg'
    },
    {
      id: '4',
      name: 'Фотоаппараты',
      description: 'Детские и профессиональные фотоаппараты',
      image: '/placeholder.svg'
    },
    {
      id: '5',
      name: 'Наушники',
      description: 'Беспроводные наушники с шумоподавлением',
      image: '/placeholder.svg'
    },
    {
      id: '6',
      name: 'Игровые консоли',
      description: 'Портативные игровые приставки и консоли',
      image: '/placeholder.svg'
    },
    {
      id: '7',
      name: 'Роутеры',
      description: 'Wi-Fi роутеры и точки доступа',
      image: '/placeholder.svg'
    }
  ];
  
  // Расширенные продукты
  const products = [
    // Смарт-часы
    {
      id: 'e635efae-a4b6-492f-82cb-b5301e0d8c17',
      title: 'Умные смарт-часы 8 серии Smart Watch X8 SE 8 Gray 45mm',
      description: 'Современные умные часы с мониторингом здоровья и уведомлениями',
      price: 4500,
      category: 'Смарт-часы',
      image_url: '/placeholder.svg',
      rating: 4.8,
      in_stock: 1,
      stock_quantity: 15,
      colors: JSON.stringify(['Серый', 'Черный']),
      specifications: JSON.stringify({
        'Экран': '1.4" AMOLED',
        'Батарея': '350mAh',
        'Водонепроницаемость': 'IP68',
        'Размер': '45mm'
      }),
      is_new: 1,
      is_bestseller: 1,
      country_of_origin: 'Китай',
      material: 'Пластик, металл',
      article_number: 'X8-SE-001',
      barcode: '1234567890123'
    },
    {
      id: '3ada4358-9d3c-41a0-9ed5-8d3b31dbcef7',
      title: 'Часы Smart умные наручные X8 Mini Smart черные',
      description: 'Компактные умные часы с фитнес-трекингом',
      price: 3200,
      category: 'Смарт-часы',
      image_url: '/placeholder.svg',
      rating: 4.7,
      in_stock: 1,
      stock_quantity: 12,
      colors: JSON.stringify(['Черный', 'Серебристый']),
      specifications: JSON.stringify({
        'Экран': '1.2" IPS',
        'Батарея': '280mAh',
        'Водонепроницаемость': 'IP67',
        'Размер': '38mm'
      }),
      is_new: 0,
      is_bestseller: 1,
      country_of_origin: 'Китай',
      material: 'Пластик',
      article_number: 'X8-MINI-001',
      barcode: '1234567890124'
    },
    {
      id: '08e11c65-2ff5-4dff-b73b-95d99d9ca607',
      title: 'Умные смарт-часы 8 серии LK8 SE серебряные 44 мм',
      description: 'Элегантные серебряные часы с расширенным функционалом',
      price: 5200,
      category: 'Смарт-часы',
      image_url: '/placeholder.svg',
      rating: 4.9,
      in_stock: 1,
      stock_quantity: 8,
      colors: JSON.stringify(['Серебристый', 'Золотой']),
      specifications: JSON.stringify({
        'Экран': '1.5" AMOLED',
        'Батарея': '400mAh',
        'Водонепроницаемость': 'IP68',
        'Размер': '44mm'
      }),
      is_new: 1,
      is_bestseller: 0,
      country_of_origin: 'Китай',
      material: 'Металл, стекло',
      article_number: 'LK8-SE-001',
      barcode: '1234567890125'
    },
    
    // Планшеты
    {
      id: '4d9996f0-69e5-4583-8379-cac8529ae4db',
      title: 'Планшет Android с клавиатурой 1 ТБ S9 Ultra игровой золотой',
      description: 'Мощный игровой планшет с большой памятью и клавиатурой',
      price: 25000,
      category: 'Планшеты',
      image_url: '/placeholder.svg',
      rating: 4.8,
      in_stock: 1,
      stock_quantity: 5,
      colors: JSON.stringify(['Золотой', 'Серебристый']),
      specifications: JSON.stringify({
        'Экран': '11" IPS',
        'Процессор': 'MediaTek Dimensity 1200',
        'Память': '1TB ROM + 8GB RAM',
        'Операционная система': 'Android 12'
      }),
      is_new: 1,
      is_bestseller: 1,
      country_of_origin: 'Китай',
      material: 'Металл, стекло',
      article_number: 'S9-ULTRA-001',
      barcode: '1234567890126'
    },
    {
      id: '847251bd-9cb0-4989-9b2d-d77812c5bf72',
      title: 'Планшет Android игровой с клавиатурой 512 ГБ WO 8G синий',
      description: 'Игровой планшет с клавиатурой и большим объемом памяти',
      price: 18000,
      category: 'Планшеты',
      image_url: '/placeholder.svg',
      rating: 4.6,
      in_stock: 1,
      stock_quantity: 7,
      colors: JSON.stringify(['Синий', 'Черный']),
      specifications: JSON.stringify({
        'Экран': '10.1" IPS',
        'Процессор': 'MediaTek MT8183',
        'Память': '512GB ROM + 4GB RAM',
        'Операционная система': 'Android 11'
      }),
      is_new: 0,
      is_bestseller: 1,
      country_of_origin: 'Китай',
      material: 'Пластик, стекло',
      article_number: 'WO-8G-001',
      barcode: '1234567890127'
    },
    {
      id: 'e8dfc339-221b-40ae-9e92-219bbabaf42e',
      title: 'Планшет Android игровой с клавиатурой 1 ТБ L16 Max синий',
      description: 'Максимальная версия игрового планшета с клавиатурой',
      price: 22000,
      category: 'Планшеты',
      image_url: '/placeholder.svg',
      rating: 4.7,
      in_stock: 1,
      stock_quantity: 3,
      colors: JSON.stringify(['Синий', 'Серый']),
      specifications: JSON.stringify({
        'Экран': '12" IPS',
        'Процессор': 'MediaTek Dimensity 1100',
        'Память': '1TB ROM + 6GB RAM',
        'Операционная система': 'Android 12'
      }),
      is_new: 1,
      is_bestseller: 0,
      country_of_origin: 'Китай',
      material: 'Металл, стекло',
      article_number: 'L16-MAX-001',
      barcode: '1234567890128'
    },
    
    // Проекторы
    {
      id: 'd723f536-f162-4f26-9b65-5f1c0dd3b967',
      title: 'Домашний мини проектор на стену с телефона M20 Full HD',
      description: 'Компактный проектор для домашнего кинотеатра',
      price: 8500,
      category: 'Проекторы',
      image_url: '/placeholder.svg',
      rating: 4.5,
      in_stock: 1,
      stock_quantity: 10,
      colors: JSON.stringify(['Белый', 'Черный']),
      specifications: JSON.stringify({
        'Разрешение': '1920x1080',
        'Яркость': '3000 ANSI люмен',
        'Контрастность': '1000:1',
        'Подключение': 'HDMI, USB, Wi-Fi'
      }),
      is_new: 0,
      is_bestseller: 1,
      country_of_origin: 'Китай',
      material: 'Пластик',
      article_number: 'M20-FHD-001',
      barcode: '1234567890129'
    },
    {
      id: '35367e8c-d5a5-49aa-a3a6-df3d96a68eed',
      title: 'Домашний мини проектор на стену с телефона Luckyroad X9 HD',
      description: 'Высококачественный проектор с поддержкой HD',
      price: 12000,
      category: 'Проекторы',
      image_url: '/placeholder.svg',
      rating: 4.7,
      in_stock: 1,
      stock_quantity: 6,
      colors: JSON.stringify(['Белый']),
      specifications: JSON.stringify({
        'Разрешение': '1920x1080',
        'Яркость': '4000 ANSI люмен',
        'Контрастность': '1500:1',
        'Подключение': 'HDMI, USB, Bluetooth'
      }),
      is_new: 1,
      is_bestseller: 0,
      country_of_origin: 'Китай',
      material: 'Пластик, металл',
      article_number: 'X9-HD-001',
      barcode: '1234567890130'
    },
    {
      id: 'f71c4949-1bac-4b8e-aebd-b0f9ee9b3a5e',
      title: 'Домашний мини проектор для фильмов на стену с телефона X9',
      description: 'Универсальный проектор для фильмов и презентаций',
      price: 9500,
      category: 'Проекторы',
      image_url: '/placeholder.svg',
      rating: 4.6,
      in_stock: 1,
      stock_quantity: 8,
      colors: JSON.stringify(['Белый', 'Серый']),
      specifications: JSON.stringify({
        'Разрешение': '1920x1080',
        'Яркость': '3500 ANSI люмен',
        'Контрастность': '1200:1',
        'Подключение': 'HDMI, USB, Wi-Fi'
      }),
      is_new: 0,
      is_bestseller: 1,
      country_of_origin: 'Китай',
      material: 'Пластик',
      article_number: 'X9-PRO-001',
      barcode: '1234567890131'
    },
    
    // Фотоаппараты
    {
      id: '2817b386-12c5-4b9b-8e7e-6ce0909cd2de',
      title: 'Детский фотоаппарат для мгновенной печати Q5 голубой',
      description: 'Детский фотоаппарат с мгновенной печатью фотографий',
      price: 2800,
      category: 'Фотоаппараты',
      image_url: '/placeholder.svg',
      rating: 4.4,
      in_stock: 1,
      stock_quantity: 20,
      colors: JSON.stringify(['Голубой', 'Розовый', 'Зеленый']),
      specifications: JSON.stringify({
        'Разрешение': '5MP',
        'Печать': 'Мгновенная',
        'Батарея': 'Аккумулятор',
        'Возраст': '3+ лет'
      }),
      is_new: 1,
      is_bestseller: 1,
      country_of_origin: 'Китай',
      material: 'Пластик',
      article_number: 'Q5-KIDS-001',
      barcode: '1234567890132'
    },
    {
      id: '9482f3f5-ad70-4d67-9a10-01575f2f6a6b',
      title: 'Детский новогодний фотоаппарат для мгновенной печати',
      description: 'Новогодний фотоаппарат с праздничным дизайном',
      price: 3200,
      category: 'Фотоаппараты',
      image_url: '/placeholder.svg',
      rating: 4.5,
      in_stock: 1,
      stock_quantity: 15,
      colors: JSON.stringify(['Красный', 'Зеленый']),
      specifications: JSON.stringify({
        'Разрешение': '8MP',
        'Печать': 'Мгновенная',
        'Батарея': 'Аккумулятор',
        'Дизайн': 'Новогодний'
      }),
      is_new: 1,
      is_bestseller: 0,
      country_of_origin: 'Китай',
      material: 'Пластик',
      article_number: 'Q5-NEWYEAR-001',
      barcode: '1234567890133'
    },
    
    // Наушники
    {
      id: '4d565fdb-4657-4782-b20e-51e72eb9590d',
      title: 'Наушники беспроводные Air 2',
      description: 'Беспроводные наушники с качественным звуком',
      price: 1500,
      category: 'Наушники',
      image_url: '/placeholder.svg',
      rating: 4.3,
      in_stock: 1,
      stock_quantity: 25,
      colors: JSON.stringify(['Белый', 'Черный']),
      specifications: JSON.stringify({
        'Тип': 'TWS',
        'Bluetooth': '5.0',
        'Время работы': '4 часа',
        'Зарядка': 'USB-C'
      }),
      is_new: 0,
      is_bestseller: 1,
      country_of_origin: 'Китай',
      material: 'Пластик',
      article_number: 'AIR-2-001',
      barcode: '1234567890134'
    },
    {
      id: 'c7c534b5-90c0-4126-b8fb-ae86719169dd',
      title: 'Наушники беспроводные Air Pro с шумоподавлением',
      description: 'Премиум наушники с активным шумоподавлением',
      price: 3500,
      category: 'Наушники',
      image_url: '/placeholder.svg',
      rating: 4.7,
      in_stock: 1,
      stock_quantity: 12,
      colors: JSON.stringify(['Белый', 'Черный', 'Серый']),
      specifications: JSON.stringify({
        'Тип': 'TWS',
        'Bluetooth': '5.2',
        'Шумоподавление': 'Активное',
        'Время работы': '6 часов'
      }),
      is_new: 1,
      is_bestseller: 1,
      country_of_origin: 'Китай',
      material: 'Пластик, металл',
      article_number: 'AIR-PRO-001',
      barcode: '1234567890135'
    },
    
    // Игровые консоли
    {
      id: '6e71445b-f9e3-42a7-aed7-d249cb828816',
      title: 'Игровая приставка консоль Game Box 2в1 для детей и взрослых',
      description: 'Универсальная игровая консоль для всей семьи',
      price: 4200,
      category: 'Игровые консоли',
      image_url: '/placeholder.svg',
      rating: 4.6,
      in_stock: 1,
      stock_quantity: 8,
      colors: JSON.stringify(['Черный', 'Красный']),
      specifications: JSON.stringify({
        'Процессор': 'ARM Cortex-A53',
        'Память': '8GB',
        'Игры': 'Встроенные',
        'Подключение': 'HDMI, USB'
      }),
      is_new: 1,
      is_bestseller: 0,
      country_of_origin: 'Китай',
      material: 'Пластик',
      article_number: 'GAMEBOX-2V1-001',
      barcode: '1234567890136'
    },
    {
      id: '9004aa19-1b0e-4bf0-991a-9dd0c70a968d',
      title: 'Портативная игровая приставка Gamepad X7 8GB для детей',
      description: 'Портативная игровая приставка для детей',
      price: 2800,
      category: 'Игровые консоли',
      image_url: '/placeholder.svg',
      rating: 4.4,
      in_stock: 1,
      stock_quantity: 15,
      colors: JSON.stringify(['Синий', 'Зеленый', 'Красный']),
      specifications: JSON.stringify({
        'Экран': '7" IPS',
        'Память': '8GB',
        'Игры': 'Встроенные',
        'Батарея': '4000mAh'
      }),
      is_new: 0,
      is_bestseller: 1,
      country_of_origin: 'Китай',
      material: 'Пластик',
      article_number: 'GAMEPAD-X7-001',
      barcode: '1234567890137'
    },
    
    // Роутеры
    {
      id: '8cdaac56-32f6-4561-a93c-533b3525b35a',
      title: 'Wi-Fi роутер 4G LTE с SIM картой точка доступа с дисплеем',
      description: 'Мобильный роутер с поддержкой 4G LTE',
      price: 3800,
      category: 'Роутеры',
      image_url: '/placeholder.svg',
      rating: 4.5,
      in_stock: 1,
      stock_quantity: 6,
      colors: JSON.stringify(['Белый', 'Черный']),
      specifications: JSON.stringify({
        'Стандарт': '4G LTE',
        'Wi-Fi': '802.11n',
        'SIM': 'Поддержка',
        'Дисплей': 'LCD'
      }),
      is_new: 1,
      is_bestseller: 0,
      country_of_origin: 'Китай',
      material: 'Пластик',
      article_number: '4G-ROUTER-001',
      barcode: '1234567890138'
    }
  ];
  
  // Вставляем категории
  const insertCategory = db.prepare(`
    INSERT OR REPLACE INTO categories (id, name, description, image)
    VALUES (?, ?, ?, ?)
  `);
  
  categories.forEach(category => {
    insertCategory.run([category.id, category.name, category.description, category.image], (err) => {
      if (err) {
        console.error(`❌ Ошибка добавления категории ${category.name}:`, err.message);
      } else {
        console.log(`✅ Категория "${category.name}" добавлена`);
      }
    });
  });
  
  // Вставляем продукты
  const insertProduct = db.prepare(`
    INSERT OR REPLACE INTO products (
      id, title, description, price, category, image_url, rating, 
      in_stock, stock_quantity, colors, specifications, is_new, 
      is_bestseller, country_of_origin, material, article_number, barcode
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  products.forEach(product => {
    insertProduct.run([
      product.id, product.title, product.description, product.price,
      product.category, product.image_url, product.rating, product.in_stock,
      product.stock_quantity, product.colors, product.specifications,
      product.is_new, product.is_bestseller, product.country_of_origin,
      product.material, product.article_number, product.barcode
    ], (err) => {
      if (err) {
        console.error(`❌ Ошибка добавления продукта ${product.title}:`, err.message);
      } else {
        console.log(`✅ Продукт "${product.title}" добавлен`);
      }
    });
  });
  
  // Закрываем базу данных
  setTimeout(() => {
    db.close((err) => {
      if (err) {
        console.error('❌ Ошибка закрытия базы данных:', err.message);
      } else {
        console.log('✅ База данных закрыта');
        console.log('\n🎉 Расширенная база данных SQLite создана успешно!');
        console.log(`📁 Файл: ${path.join(__dirname, '../database.db')}`);
        console.log(`📦 Тестовых продуктов: ${products.length}`);
        console.log(`📂 Тестовых категорий: ${categories.length}`);
        console.log('\n📊 Статистика по категориям:');
        const categoryStats = {};
        products.forEach(p => {
          categoryStats[p.category] = (categoryStats[p.category] || 0) + 1;
        });
        Object.entries(categoryStats).forEach(([category, count]) => {
          console.log(`   ${category}: ${count} товаров`);
        });
      }
    });
  }, 3000);
}

// Запускаем создание базы данных
if (require.main === module) {
  createSQLiteDatabase();
}

module.exports = createSQLiteDatabase; 