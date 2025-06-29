import { sqliteDB } from '@/data/sqlite/database';
import { v4 as uuidv4 } from 'uuid';

// Интерфейс для категории
export interface Category {
  imageUrl: string;
  id: string;
  name: string;
  updated_at: string; 
  created_at: string;
}

// Функция для получения всех категорий из SQLite
export const fetchCategoriesFromSQLite = async (): Promise<Category[]> => {
  try {
    const categories = await sqliteDB.getCategory();
    return categories; 
  } catch (err) {
    console.error('Ошибка при загрузке категорий из SQLite:', err);
    return [];
  }
};

// Упрощенные функции для работы с категориями
// Эти функции будут реализованы позже, когда будет готова полная SQLite интеграция

export const addCategoryToSQLite = async (name: string, imageUrl: string = "/placeholder.svg", description?: string): Promise<boolean> => {
  console.log('Добавление категории в SQLite:', { name, imageUrl, description });
  // TODO: Реализовать добавление категории в SQLite
  return true;
};

export const updateCategoryImageInSQLite = async (name: string, imageUrl: string): Promise<boolean> => {
  console.log('Обновление изображения категории в SQLite:', { name, imageUrl });
  // TODO: Реализовать обновление изображения категории в SQLite
  return true;
};

export const removeCategoryFromSQLite = async (name: string): Promise<boolean> => {
  console.log('Удаление категории из SQLite:', { name });
  // TODO: Реализовать удаление категории из SQLite
  return true;
};

export const updateProductsCategoryInSQLite = async (oldCategory: string, newCategory: string): Promise<boolean> => {
  console.log('Обновление категории товаров в SQLite:', { oldCategory, newCategory });
  // TODO: Реализовать обновление категории товаров в SQLite
  return true;
};

export const getProductsByCategoryFromSQLite = async (category: string) => {
  console.log('Получение товаров по категории из SQLite:', { category });
  // TODO: Реализовать получение товаров по категории из SQLite
  return [];
};

export const getCategoryByIdFromSQLite = async (id: string): Promise<Category | undefined> => {
  console.log('Получение категории по ID из SQLite:', { id });
  // TODO: Реализовать получение категории по ID из SQLite
  return undefined;
};

export const getCategoryByNameFromSQLite = async (name: string): Promise<Category | undefined> => {
  console.log('Получение категории по имени из SQLite:', { name });
  // TODO: Реализовать получение категории по имени из SQLite
  return undefined;
};

// // Функция для обновления категории
// export const updateCategoryInSQLite = async (id: string, updates: Partial<Category>): Promise<boolean> => {
//   try {
//     const db = sqliteDB.getDatabase();
//     const run = promisify(db.run.bind(db));

//     const fields = [];
//     const values = [];

//     if (updates.name !== undefined) {
//       fields.push('name = ?');
//       values.push(updates.name);
//     }
//     if (updates.description !== undefined) {
//       fields.push('description = ?');
//       values.push(updates.description);
//     }
//     if (updates.image !== undefined) {
//       fields.push('image = ?');
//       values.push(updates.image);
//     }

//     if (fields.length === 0) {
//       return true; // Нет изменений
//     }

//     values.push(id);

//     const result = await run(`UPDATE categories SET ${fields.join(', ')} WHERE id = ?`, values);
    
//     return result.changes > 0;
//   } catch (err) {
//     console.error('Ошибка при обновлении категории в SQLite:', err);
//     return false;
//   }
// };

// // Функция для подсчета товаров в категории
// export const getCategoryProductCountFromSQLite = async (categoryName: string): Promise<number> => {
//   try {
//     const db = sqliteDB.getDatabase();
//     const get = promisify(db.get.bind(db));

//     const result = await get('SELECT COUNT(*) as count FROM products WHERE category = ? AND archived = FALSE', [categoryName]);
    
//     return result.count || 0;
//   } catch (err) {
//     console.error('Ошибка при подсчете товаров в категории из SQLite:', err);
//     return 0;
//   }
 