import { Product } from '@/types/product';

export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  created_at: string;
  updated_at: string;
}

export class SQLiteDatabase {
  private products: Product[] = [];
  private categories: Category[] = [];
  private initialized = false;

  constructor() {
    console.log('🔧 SQLiteDatabase: Constructor called');
  }

  async init(): Promise<void> {
    console.log('🚀 SQLiteDatabase: Starting initialization...');
    
    // Сразу создаем моковые данные для гарантированной работы
    this.initializeMockData();
    this.initialized = true;
    
    console.log('✅ SQLiteDatabase: Mock data initialized successfully');
    console.log(`📦 Products: ${this.products.length}`);
    console.log(`📂 Categories: ${this.categories.length}`);
  }

  async getProducts(): Promise<Product[]> {
    console.log('📦 SQLiteDatabase: getProducts() called');
    
    if (!this.initialized) {
      console.log('⚠️ SQLiteDatabase: Not initialized, initializing now...');
      await this.init();
    }
    
    const filteredProducts = this.products.filter(p => !p.archived);
    console.log(`✅ SQLiteDatabase: Returning ${filteredProducts.length} products`);
    return filteredProducts;
  }

  async getCategory(): Promise<Category[]> {
    console.log('📂 SQLiteDatabase: getCategory() called');
    
    if (!this.initialized) {
      console.log('⚠️ SQLiteDatabase: Not initialized, initializing now...');
      await this.init();
    }
    
    console.log(`✅ SQLiteDatabase: Returning ${this.categories.length} categories`);
    return this.categories;
  }

  deserializeJSON(json: string): any {
    try {
      return JSON.parse(json);
    } catch {
      return {};
    }
  }

  serializeJSON(obj: any): string {
    return JSON.stringify(obj);
  }

  private initializeMockData(): void {
    console.log('📝 SQLiteDatabase: Initializing mock data...');
    
    // Расширенные категории
    this.categories = [
      {
        id: '1',
        name: 'Смарт-часы',
        description: 'Умные часы и фитнес-браслеты для активного образа жизни',
        imageUrl: '/placeholder.svg',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Планшеты',
        description: 'Планшеты и планшетные компьютеры для работы и развлечений',
        imageUrl: '/placeholder.svg',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Проекторы',
        description: 'Домашние и портативные проекторы для кинотеатра',
        imageUrl: '/placeholder.svg',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Фотоаппараты',
        description: 'Детские и профессиональные фотоаппараты',
        imageUrl: '/placeholder.svg',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '5',
        name: 'Наушники',
        description: 'Беспроводные наушники с шумоподавлением',
        imageUrl: '/placeholder.svg',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '6',
        name: 'Игровые консоли',
        description: 'Портативные игровые приставки и консоли',
        imageUrl: '/placeholder.svg',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '7',
        name: 'Роутеры',
        description: 'Wi-Fi роутеры и точки доступа',
        imageUrl: '/placeholder.svg',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    // Расширенные продукты
    this.products = [
      // Смарт-часы
      {
        id: 'e635efae-a4b6-492f-82cb-b5301e0d8c17',
        title: 'Умные смарт-часы 8 серии Smart Watch X8 SE 8 Gray 45mm',
        description: 'Современные умные часы с мониторингом здоровья и уведомлениями',
        price: 4500,
        category: 'Смарт-часы',
        imageUrl: '/placeholder.svg',
        rating: 4.8,
        inStock: true,
        stockQuantity: 15,
        colors: ['Серый', 'Черный'],
        specifications: {
          'Экран': '1.4" AMOLED',
          'Батарея': '350mAh',
          'Водонепроницаемость': 'IP68',
          'Размер': '45mm'
        },
        archived: false,
        isNew: true,
        isBestseller: true,
        countryOfOrigin: 'Китай',
        material: 'Пластик, металл',
        articleNumber: 'X8-SE-001',
        barcode: '1234567890123'
      },
      {
        id: '3ada4358-9d3c-41a0-9ed5-8d3b31dbcef7',
        title: 'Часы Smart умные наручные X8 Mini Smart черные',
        description: 'Компактные умные часы с фитнес-трекингом',
        price: 3200,
        category: 'Смарт-часы',
        imageUrl: '/placeholder.svg',
        rating: 4.7,
        inStock: true,
        stockQuantity: 12,
        colors: ['Черный', 'Серебристый'],
        specifications: {
          'Экран': '1.2" IPS',
          'Батарея': '280mAh',
          'Водонепроницаемость': 'IP67',
          'Размер': '38mm'
        },
        archived: false,
        isNew: false,
        isBestseller: true,
        countryOfOrigin: 'Китай',
        material: 'Пластик',
        articleNumber: 'X8-MINI-001',
        barcode: '1234567890124'
      },
      {
        id: '08e11c65-2ff5-4dff-b73b-95d99d9ca607',
        title: 'Умные смарт-часы 8 серии LK8 SE серебряные 44 мм',
        description: 'Элегантные серебряные часы с расширенным функционалом',
        price: 5200,
        category: 'Смарт-часы',
        imageUrl: '/placeholder.svg',
        rating: 4.9,
        inStock: true,
        stockQuantity: 8,
        colors: ['Серебристый', 'Золотой'],
        specifications: {
          'Экран': '1.5" AMOLED',
          'Батарея': '400mAh',
          'Водонепроницаемость': 'IP68',
          'Размер': '44mm'
        },
        archived: false,
        isNew: true,
        isBestseller: false,
        countryOfOrigin: 'Китай',
        material: 'Металл, стекло',
        articleNumber: 'LK8-SE-001',
        barcode: '1234567890125'
      },
      
      // Планшеты
      {
        id: '4d9996f0-69e5-4583-8379-cac8529ae4db',
        title: 'Планшет Android с клавиатурой 1 ТБ S9 Ultra игровой золотой',
        description: 'Мощный игровой планшет с большой памятью и клавиатурой',
        price: 25000,
        category: 'Планшеты',
        imageUrl: '/placeholder.svg',
        rating: 4.8,
        inStock: true,
        stockQuantity: 5,
        colors: ['Золотой', 'Серебристый'],
        specifications: {
          'Экран': '11" IPS',
          'Процессор': 'MediaTek Dimensity 1200',
          'Память': '1TB ROM + 8GB RAM',
          'Операционная система': 'Android 12'
        },
        archived: false,
        isNew: true,
        isBestseller: true,
        countryOfOrigin: 'Китай',
        material: 'Металл, стекло',
        articleNumber: 'S9-ULTRA-001',
        barcode: '1234567890126'
      },
      {
        id: '847251bd-9cb0-4989-9b2d-d77812c5bf72',
        title: 'Планшет Android игровой с клавиатурой 512 ГБ WO 8G синий',
        description: 'Игровой планшет с клавиатурой и большим объемом памяти',
        price: 18000,
        category: 'Планшеты',
        imageUrl: '/placeholder.svg',
        rating: 4.6,
        inStock: true,
        stockQuantity: 7,
        colors: ['Синий', 'Черный'],
        specifications: {
          'Экран': '10.1" IPS',
          'Процессор': 'MediaTek MT8183',
          'Память': '512GB ROM + 4GB RAM',
          'Операционная система': 'Android 11'
        },
        archived: false,
        isNew: false,
        isBestseller: true,
        countryOfOrigin: 'Китай',
        material: 'Пластик, стекло',
        articleNumber: 'WO-8G-001',
        barcode: '1234567890127'
      },
      {
        id: 'e8dfc339-221b-40ae-9e92-219bbabaf42e',
        title: 'Планшет Android игровой с клавиатурой 1 ТБ L16 Max синий',
        description: 'Максимальная версия игрового планшета с клавиатурой',
        price: 22000,
        category: 'Планшеты',
        imageUrl: '/placeholder.svg',
        rating: 4.7,
        inStock: true,
        stockQuantity: 3,
        colors: ['Синий', 'Серый'],
        specifications: {
          'Экран': '12" IPS',
          'Процессор': 'MediaTek Dimensity 1100',
          'Память': '1TB ROM + 6GB RAM',
          'Операционная система': 'Android 12'
        },
        archived: false,
        isNew: true,
        isBestseller: false,
        countryOfOrigin: 'Китай',
        material: 'Металл, стекло',
        articleNumber: 'L16-MAX-001',
        barcode: '1234567890128'
      },
      
      // Проекторы
      {
        id: 'd723f536-f162-4f26-9b65-5f1c0dd3b967',
        title: 'Домашний мини проектор на стену с телефона M20 Full HD',
        description: 'Компактный проектор для домашнего кинотеатра',
        price: 8500,
        category: 'Проекторы',
        imageUrl: '/placeholder.svg',
        rating: 4.5,
        inStock: true,
        stockQuantity: 10,
        colors: ['Белый', 'Черный'],
        specifications: {
          'Разрешение': '1920x1080',
          'Яркость': '3000 ANSI люмен',
          'Контрастность': '1000:1',
          'Подключение': 'HDMI, USB, Wi-Fi'
        },
        archived: false,
        isNew: false,
        isBestseller: true,
        countryOfOrigin: 'Китай',
        material: 'Пластик',
        articleNumber: 'M20-FHD-001',
        barcode: '1234567890129'
      },
      {
        id: '35367e8c-d5a5-49aa-a3a6-df3d96a68eed',
        title: 'Домашний мини проектор на стену с телефона Luckyroad X9 HD',
        description: 'Высококачественный проектор с поддержкой HD',
        price: 12000,
        category: 'Проекторы',
        imageUrl: '/placeholder.svg',
        rating: 4.7,
        inStock: true,
        stockQuantity: 6,
        colors: ['Белый'],
        specifications: {
          'Разрешение': '1920x1080',
          'Яркость': '4000 ANSI люмен',
          'Контрастность': '1500:1',
          'Подключение': 'HDMI, USB, Bluetooth'
        },
        archived: false,
        isNew: true,
        isBestseller: false,
        countryOfOrigin: 'Китай',
        material: 'Пластик, металл',
        articleNumber: 'X9-HD-001',
        barcode: '1234567890130'
      },
      {
        id: 'f71c4949-1bac-4b8e-aebd-b0f9ee9b3a5e',
        title: 'Домашний мини проектор для фильмов на стену с телефона X9',
        description: 'Универсальный проектор для фильмов и презентаций',
        price: 9500,
        category: 'Проекторы',
        imageUrl: '/placeholder.svg',
        rating: 4.6,
        inStock: true,
        stockQuantity: 8,
        colors: ['Белый', 'Серый'],
        specifications: {
          'Разрешение': '1920x1080',
          'Яркость': '3500 ANSI люмен',
          'Контрастность': '1200:1',
          'Подключение': 'HDMI, USB, Wi-Fi'
        },
        archived: false,
        isNew: false,
        isBestseller: true,
        countryOfOrigin: 'Китай',
        material: 'Пластик',
        articleNumber: 'X9-PRO-001',
        barcode: '1234567890131'
      },
      
      // Фотоаппараты
      {
        id: '2817b386-12c5-4b9b-8e7e-6ce0909cd2de',
        title: 'Детский фотоаппарат для мгновенной печати Q5 голубой',
        description: 'Детский фотоаппарат с мгновенной печатью фотографий',
        price: 2800,
        category: 'Фотоаппараты',
        imageUrl: '/placeholder.svg',
        rating: 4.4,
        inStock: true,
        stockQuantity: 20,
        colors: ['Голубой', 'Розовый', 'Зеленый'],
        specifications: {
          'Разрешение': '5MP',
          'Печать': 'Мгновенная',
          'Батарея': 'Аккумулятор',
          'Возраст': '3+ лет'
        },
        archived: false,
        isNew: true,
        isBestseller: true,
        countryOfOrigin: 'Китай',
        material: 'Пластик',
        articleNumber: 'Q5-KIDS-001',
        barcode: '1234567890132'
      },
      {
        id: '9482f3f5-ad70-4d67-9a10-01575f2f6a6b',
        title: 'Детский новогодний фотоаппарат для мгновенной печати',
        description: 'Новогодний фотоаппарат с праздничным дизайном',
        price: 3200,
        category: 'Фотоаппараты',
        imageUrl: '/placeholder.svg',
        rating: 4.5,
        inStock: true,
        stockQuantity: 15,
        colors: ['Красный', 'Зеленый'],
        specifications: {
          'Разрешение': '8MP',
          'Печать': 'Мгновенная',
          'Батарея': 'Аккумулятор',
          'Дизайн': 'Новогодний'
        },
        archived: false,
        isNew: true,
        isBestseller: false,
        countryOfOrigin: 'Китай',
        material: 'Пластик',
        articleNumber: 'Q5-NEWYEAR-001',
        barcode: '1234567890133'
      },
      
      // Наушники
      {
        id: '4d565fdb-4657-4782-b20e-51e72eb9590d',
        title: 'Наушники беспроводные Air 2',
        description: 'Беспроводные наушники с качественным звуком',
        price: 1500,
        category: 'Наушники',
        imageUrl: '/placeholder.svg',
        rating: 4.3,
        inStock: true,
        stockQuantity: 25,
        colors: ['Белый', 'Черный'],
        specifications: {
          'Тип': 'TWS',
          'Bluetooth': '5.0',
          'Время работы': '4 часа',
          'Зарядка': 'USB-C'
        },
        archived: false,
        isNew: false,
        isBestseller: true,
        countryOfOrigin: 'Китай',
        material: 'Пластик',
        articleNumber: 'AIR-2-001',
        barcode: '1234567890134'
      },
      {
        id: 'c7c534b5-90c0-4126-b8fb-ae86719169dd',
        title: 'Наушники беспроводные Air Pro с шумоподавлением',
        description: 'Премиум наушники с активным шумоподавлением',
        price: 3500,
        category: 'Наушники',
        imageUrl: '/placeholder.svg',
        rating: 4.7,
        inStock: true,
        stockQuantity: 12,
        colors: ['Белый', 'Черный', 'Серый'],
        specifications: {
          'Тип': 'TWS',
          'Bluetooth': '5.2',
          'Шумоподавление': 'Активное',
          'Время работы': '6 часов'
        },
        archived: false,
        isNew: true,
        isBestseller: true,
        countryOfOrigin: 'Китай',
        material: 'Пластик, металл',
        articleNumber: 'AIR-PRO-001',
        barcode: '1234567890135'
      },
      
      // Игровые консоли
      {
        id: '6e71445b-f9e3-42a7-aed7-d249cb828816',
        title: 'Игровая приставка консоль Game Box 2в1 для детей и взрослых',
        description: 'Универсальная игровая консоль для всей семьи',
        price: 4200,
        category: 'Игровые консоли',
        imageUrl: '/placeholder.svg',
        rating: 4.6,
        inStock: true,
        stockQuantity: 8,
        colors: ['Черный', 'Красный'],
        specifications: {
          'Процессор': 'ARM Cortex-A53',
          'Память': '8GB',
          'Игры': 'Встроенные',
          'Подключение': 'HDMI, USB'
        },
        archived: false,
        isNew: true,
        isBestseller: false,
        countryOfOrigin: 'Китай',
        material: 'Пластик',
        articleNumber: 'GAMEBOX-2V1-001',
        barcode: '1234567890136'
      },
      {
        id: '9004aa19-1b0e-4bf0-991a-9dd0c70a968d',
        title: 'Портативная игровая приставка Gamepad X7 8GB для детей',
        description: 'Портативная игровая приставка для детей',
        price: 2800,
        category: 'Игровые консоли',
        imageUrl: '/placeholder.svg',
        rating: 4.4,
        inStock: true,
        stockQuantity: 15,
        colors: ['Синий', 'Зеленый', 'Красный'],
        specifications: {
          'Экран': '7" IPS',
          'Память': '8GB',
          'Игры': 'Встроенные',
          'Батарея': '4000mAh'
        },
        archived: false,
        isNew: false,
        isBestseller: true,
        countryOfOrigin: 'Китай',
        material: 'Пластик',
        articleNumber: 'GAMEPAD-X7-001',
        barcode: '1234567890137'
      },
      
      // Роутеры
      {
        id: '8cdaac56-32f6-4561-a93c-533b3525b35a',
        title: 'Wi-Fi роутер 4G LTE с SIM картой точка доступа с дисплеем',
        description: 'Мобильный роутер с поддержкой 4G LTE',
        price: 3800,
        category: 'Роутеры',
        imageUrl: '/placeholder.svg',
        rating: 4.5,
        inStock: true,
        stockQuantity: 6,
        colors: ['Белый', 'Черный'],
        specifications: {
          'Стандарт': '4G LTE',
          'Wi-Fi': '802.11n',
          'SIM': 'Поддержка',
          'Дисплей': 'LCD'
        },
        archived: false,
        isNew: true,
        isBestseller: false,
        countryOfOrigin: 'Китай',
        material: 'Пластик',
        articleNumber: '4G-ROUTER-001',
        barcode: '1234567890138'
      }
    ];
    
    console.log('✅ SQLiteDatabase: Mock data initialized');
  }
}

// Создаем экземпляр базы данных
export const sqliteDB = new SQLiteDatabase();

// Экспортируем функцию для получения базы данных
export const getDatabase = () => sqliteDB;

// Инициализация базы при запуске приложения - только в браузере
if (typeof window !== 'undefined') {
  console.log('🚀 SQLiteDatabase: Starting initialization on module load...');
  sqliteDB.init().catch((error) => {
    console.error('❌ SQLiteDatabase: Initialization failed:', error);
  });
}
