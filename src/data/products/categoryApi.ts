import { 
  fetchCategoriesFromSupabase, 
  addCategoryToSupabase, 
  updateCategoryImageInSupabase,
  removeCategoryFromSupabase,
  updateProductsCategoryInSupabase,
  getProductsByCategoryNameFromSupabase
} from './supabase/categoryApi';
import { 
  fetchCategoriesFromSQLite, 
 
  Category
} from './sqlite/categoryApi';

// Глобальная настройка для выбора источника данных (наследуем от productApi)
let useSQLite = false;

// Функция для переключения на SQLite
export const switchToSQLite = () => {
  useSQLite = true;
  console.log('Переключение на SQLite базу данных (категории)');
};

// Функция для переключения на Supabase
export const switchToSupabase = () => {
  useSQLite = false;
  console.log('Переключение на Supabase базу данных (категории)');
};

// Универсальная функция для получения всех категорий
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    if (useSQLite) {
      return await fetchCategoriesFromSQLite();
    } else {
      const supabaseCategories = await fetchCategoriesFromSQLite();
      // Преобразуем в формат SQLite для совместимости
      return supabaseCategories.map(cat => ({
        id: cat.name, // Используем имя как ID для совместимости
        name: cat.name,
        description: '',
        imageUrl: cat.imageUrl, // Исправляем: используем cat.image вместо cat.imageUrl
        created_at: new Date().toISOString(),
        updated_at: cat.updated_at
      }));
    }
  } catch (error) {
    console.warn('Ошибка с основным источником данных, переключаемся на SQLite:', error);
    switchToSQLite();
    return await fetchCategoriesFromSQLite();
  }
};

// // Универсальная функция для добавления категории
// export const addCategory = async (name: string, imageUrl: string = "/placeholder.svg", description?: string): Promise<boolean> => {
//   try {
//     if (useSQLite) {
//       return await addCategoryToSQLite(name, imageUrl, description);
//     } else {
//       return await addCategoryToSupabase(name, imageUrl);
//     }
//   } catch (error) {
//     console.warn('Ошибка с основным источником данных, переключаемся на SQLite:', error);
//     switchToSQLite();
//     return await addCategoryToSQLite(name, imageUrl, description);
//   }
// };

// // Универсальная функция для обновления изображения категории
// export const updateCategoryImage = async (name: string, imageUrl: string): Promise<boolean> => {
//   try {
//     if (useSQLite) {
//       return await updateCategoryImageInSQLite(name, imageUrl);
//     } else {
//       return await updateCategoryImageInSupabase(name, imageUrl);
//     }
//   } catch (error) {
//     console.warn('Ошибка с основным источником данных, переключаемся на SQLite:', error);
//     switchToSQLite();
//     return await updateCategoryImageInSQLite(name, imageUrl);
//   }
// };

// // Универсальная функция для удаления категории
// export const removeCategory = async (name: string): Promise<boolean> => {
//   try {
//     if (useSQLite) {
//       return await removeCategoryFromSQLite(name);
//     } else {
//       return await removeCategoryFromSupabase(name);
//     }
//   } catch (error) {
//     console.warn('Ошибка с основным источником данных, переключаемся на SQLite:', error);
//     switchToSQLite();
//     return await removeCategoryFromSQLite(name);
//   }
// };

// // Универсальная функция для обновления категории товаров
// export const updateProductsCategory = async (oldCategory: string, newCategory: string): Promise<boolean> => {
//   try {
//     if (useSQLite) {
//       return await updateProductsCategoryInSQLite(oldCategory, newCategory);
//     } else {
//       return await updateProductsCategoryInSupabase(oldCategory, newCategory);
//     }
//   } catch (error) {
//     console.warn('Ошибка с основным источником данных, переключаемся на SQLite:', error);
//     switchToSQLite();
//     return await updateProductsCategoryInSQLite(oldCategory, newCategory);
//   }
// };

// // Универсальная функция для получения продуктов по категории
// export const getProductsByCategoryName = async (category: string) => {
//   try {
//     if (useSQLite) {
//       return await getProductsByCategoryNameFromSQLite(category);
//     } else {
//       return await getProductsByCategoryNameFromSupabase(category);
//     }
//   } catch (error) {
//     console.warn('Ошибка с основным источником данных, переключаемся на SQLite:', error);
//     switchToSQLite();
//     return await getProductsByCategoryNameFromSQLite(category);
//   }
// };

// // Функции только для SQLite (с fallback на Supabase)

// // Получение категории по ID
// export const getCategoryById = async (id: string): Promise<Category | undefined> => {
//   try {
//     if (useSQLite) {
//       return await getCategoryByIdFromSQLite(id);
//     } else {
//       // Для Supabase используем имя как ID
//       const categories = await fetchCategoriesFromSupabase();
//       const category = categories.find(cat => cat.name === id);
//       if (category) {
//         return {
//           id: category.name,
//           name: category.name,
//           description: '',
//           imageUrl: category.imageUrl,
//           created_at: new Date().toISOString()
//         };
//       }
//       return undefined;
//     }
//   } catch (error) {
//     console.warn('Ошибка с основным источником данных, переключаемся на SQLite:', error);
//     switchToSQLite();
//     return await getCategoryByIdFromSQLite(id);
//   }
// };

// // Получение категории по имени
// export const getCategoryByName = async (name: string): Promise<Category | undefined> => {
//   try {
//     if (useSQLite) {
//       return await getCategoryByNameFromSQLite(name);
//     } else {
//       // Для Supabase используем fetchCategories и фильтруем
//       const categories = await fetchCategoriesFromSupabase();
//       const category = categories.find(cat => cat.name === name);
//       if (category) {
//         return {
//           id: category.name,
//           name: category.name,
//           description: '',
//           imageUrl: category.imageUrl,
//           created_at: new Date().toISOString()
//         };
//       }
//       return undefined;
//     }
//   } catch (error) {
//     console.warn('Ошибка с основным источником данных, переключаемся на SQLite:', error);
//     switchToSQLite();
//     return await getCategoryByNameFromSQLite(name);
//   }
// };

// // Обновление категории
// export const updateCategory = async (id: string, updates: Partial<Category>): Promise<boolean> => {
//   try {
//     if (useSQLite) {
//       return await updateCategoryInSQLite(id, updates);
//     } else {
//       // Для Supabase обновляем только изображение
//       if (updates.image) {
//         return await updateCategoryImageInSupabase(id, updates.image);
//       }
//       return true;
//     }
//   } catch (error) {
//     console.warn('Ошибка с основным источником данных, переключаемся на SQLite:', error);
//     switchToSQLite();
//     return await updateCategoryInSQLite(id, updates);
//   }
// };

// // Подсчет товаров в категории
// export const getCategoryProductCount = async (categoryName: string): Promise<number> => {
//   try {
//     if (useSQLite) {
//       return await getCategoryProductCountFromSQLite(categoryName);
//     } else {
//       // Для Supabase получаем продукты и считаем
//       const products = await getProductsByCategoryNameFromSupabase(categoryName);
//       return products.length;
//     }
//   } catch (error) {
//     console.warn('Ошибка с основным источником данных, переключаемся на SQLite:', error);
//     switchToSQLite();
//     return await getCategoryProductCountFromSQLite(categoryName);
//   }
// };

// // Экспортируем интерфейс Category
// export type { Category }; 