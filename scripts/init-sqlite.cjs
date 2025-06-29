const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

async function initSQLiteDatabase() {
  try {
    console.log('🚀 Начало инициализации SQLite базы данных...');
    
    // Путь к файлу базы данных
    const dbPath = path.join(__dirname, '../database.db');
    
    // Создаем новую базу данных
    const db = new sqlite3.Database(dbPath);
    
    // Создаем таблицы
    await createTables(db);
    
    // Добавляем тестовые данные
    await insertTestData(db);
    
    console.log('✅ SQLite база данных успешно инициализирована!');
    console.log(`📁 Файл базы данных: ${dbPath}`);
    
    db.close();
    
  } catch (error) {
    console.error('💥 Ошибка инициализации SQLite:', error);
    process.exit(1);
  }
}

function createTables(db) {
  return new Promise((resolve, reject) => {
    // Создание таблицы продуктов
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        discount_price REAL,
        category TEXT NOT NULL,
        image_url TEXT,
        additional_images TEXT,
        rating REAL DEFAULT 4.7,
        in_stock BOOLEAN DEFAULT TRUE,
        colors TEXT,
        sizes TEXT,
        material TEXT,
        country_of_origin TEXT,
        specifications TEXT,
        is_new BOOLEAN DEFAULT FALSE,
        is_bestseller BOOLEAN DEFAULT FALSE,
        article_number TEXT,
        barcode TEXT,
        ozon_url TEXT,
        wildberries_url TEXT,
        avito_url TEXT,
        archived BOOLEAN DEFAULT FALSE,
        stock_quantity INTEGER DEFAULT 0,
        color_variants TEXT,
        video_url TEXT,
        video_type TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        model_name TEXT,
        wildberries_sku TEXT
      )
    `, (err) => {
      if (err) {
        console.error('Ошибка создания таблицы products:', err);
        reject(err);
        return;
      }
      console.log('✅ Таблица products создана');
      
      // Создание таблицы категорий
      db.run(`
        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          description TEXT,
          image TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Ошибка создания таблицы categories:', err);
          reject(err);
          return;
        }
        console.log('✅ Таблица categories создана');
        
        // Создание таблицы пользователей
        db.run(`
          CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            role TEXT DEFAULT 'user',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) {
            console.error('Ошибка создания таблицы users:', err);
            reject(err);
            return;
          }
          console.log('✅ Таблица users создана');
          
          // Создание таблицы заказов
          db.run(`
            CREATE TABLE IF NOT EXISTS orders (
              id TEXT PRIMARY KEY,
              user_id TEXT NOT NULL,
              status TEXT DEFAULT 'pending',
              total REAL NOT NULL,
              created_at TEXT DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (user_id) REFERENCES users (id)
            )
          `, (err) => {
            if (err) {
              console.error('Ошибка создания таблицы orders:', err);
              reject(err);
              return;
            }
            console.log('✅ Таблица orders создана');
            
            // Создание таблицы элементов заказа
            db.run(`
              CREATE TABLE IF NOT EXISTS order_items (
                id TEXT PRIMARY KEY,
                order_id TEXT NOT NULL,
                product_id TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                price REAL NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders (id),
                FOREIGN KEY (product_id) REFERENCES products (id)
              )
            `, (err) => {
              if (err) {
                console.error('Ошибка создания таблицы order_items:', err);
                reject(err);
                return;
              }
              console.log('✅ Таблица order_items создана');
              resolve();
            });
          });
        });
      });
    });
  });
}

function insertTestData(db) {
  return new Promise((resolve, reject) => {
    // Добавляем тестовые категории
    const categories = [
      { id: '1', name: 'Смарт-часы', description: 'Умные часы и фитнес-браслеты', image: '/placeholder.svg' },
      { id: '2', name: 'Планшеты', description: 'Планшеты и планшетные компьютеры', image: '/placeholder.svg' },
      { id: '3', name: 'Проекторы', description: 'Домашние и портативные проекторы', image: '/placeholder.svg' },
      { id: '4', name: 'Фотоаппараты', description: 'Цифровые и мгновенные фотоаппараты', image: '/placeholder.svg' },
      { id: '5', name: 'Игровые приставки', description: 'Игровые консоли и приставки', image: '/placeholder.svg' }
    ];
    
    const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (id, name, description, image) VALUES (?, ?, ?, ?)');
    
    categories.forEach(category => {
      insertCategory.run([category.id, category.name, category.description, category.image]);
    });
    
    insertCategory.finalize((err) => {
      if (err) {
        console.error('Ошибка добавления категорий:', err);
        reject(err);
        return;
      }
      console.log('✅ Тестовые категории добавлены');
      
      // Добавляем тестовые продукты
      const products = [
        {
          id: 'test-1',
          title: 'Смарт-часы DT 8 Mini',
          description: 'Умные часы с мониторингом здоровья',
          price: 3500,
          category: 'Смарт-часы',
          image_url: '/placeholder.svg',
          rating: 4.8,
          stock_quantity: 10
        },
        {
          id: 'test-2',
          title: 'Планшет Android 10"',
          description: 'Планшет с Android и игровой клавиатурой',
          price: 12000,
          category: 'Планшеты',
          image_url: '/placeholder.svg',
          rating: 4.7,
          stock_quantity: 5
        },
        {
          id: 'test-3',
          title: 'Проектор Full HD',
          description: 'Домашний проектор для фильмов',
          price: 8000,
          category: 'Проекторы',
          image_url: '/placeholder.svg',
          rating: 4.6,
          stock_quantity: 3
        }
      ];
      
      const insertProduct = db.prepare(`
        INSERT OR IGNORE INTO products 
        (id, title, description, price, category, image_url, rating, stock_quantity) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      products.forEach(product => {
        insertProduct.run([
          product.id,
          product.title,
          product.description,
          product.price,
          product.category,
          product.image_url,
          product.rating,
          product.stock_quantity
        ]);
      });
      
      insertProduct.finalize((err) => {
        if (err) {
          console.error('Ошибка добавления продуктов:', err);
          reject(err);
          return;
        }
        console.log('✅ Тестовые продукты добавлены');
        resolve();
      });
    });
  });
}

// Запуск инициализации
if (require.main === module) {
  initSQLiteDatabase();
}

module.exports = initSQLiteDatabase; 