import { Product } from '@/types/product';
import { 
  fetchProductsFromSupabase, 
  addOrUpdateProductInSupabase, 
  archiveProductInSupabase,
  restoreProductInSupabase,
  removeProductFromSupabase,
  getProductByIdFromSupabase,
  getProductsByCategoryFromSupabase
} from './supabase/productApi';
import { 
  fetchProductsFromSQLite, 
 
} from './sqlite/productApi';

// Глобальная настройка для выбора источника данных
let useSQLite = false;

// Функция для переключения на SQLite
export const switchToSQLite = () => {
  useSQLite = true;
  console.log('Переключение на SQLite базу данных');
};

// Функция для переключения на Supabase
export const switchToSupabase = () => {
  useSQLite = false;
  console.log('Переключение на Supabase базу данных');
};

// Универсальная функция для получения всех продуктов
export const fetchProducts = async (): Promise<Product[]> => {
  try {
 
    return await fetchProductsFromSQLite();
 
  } catch (error) {
    console.warn('Ошибка с основным источником данных, переключаемся на SQLite:', error);
    switchToSQLite();
    return await fetchProductsFromSQLite();
  }
};

// // Универсальная функция для создания или обновления продукта
// export const addOrUpdateProduct = async (product: Product): Promise<{ success: boolean, data?: any, error?: string }> => {
//   try {
//     if (useSQLite) {
//       return await addOrUpdateProductInSQLite(product);
//     } else {
//       return await addOrUpdateProductInSupabase(product);
//     }
//   } catch (error) {
//     console.warn('Ошибка с основным источником данных, переключаемся на SQLite:', error);
//     switchToSQLite();
//     return await addOrUpdateProductInSQLite(product);
//   }
// };

// // Универсальная функция для архивирования продукта
// export const archiveProduct = async (productId: string): Promise<boolean> => {
//   try {
//     if (useSQLite) {
//       return await archiveProductInSQLite(productId);
//     } else {
//       return await archiveProductInSupabase(productId);
//     }
//   } catch (error) {
//     console.warn('Ошибка с основным источником данных, переключаемся на SQLite:', error);
//     switchToSQLite();
//     return await archiveProductInSQLite(productId);
//   }
// };

// // Универсальная функция для восстановления продукта
// export const restoreProduct = async (productId: string): Promise<boolean> => {
//   try {
//     if (useSQLite) {
//       return await restoreProductInSQLite(productId);
//     } else {
//       return await restoreProductInSupabase(productId);
//     }
//   } catch (error) {
//     console.warn('Ошибка с основным источником данных, переключаемся на SQLite:', error);
//     switchToSQLite();
//     return await restoreProductInSQLite(productId);
//   }
// };

// // Универсальная функция для удаления продукта
// export const removeProduct = async (productId: string): Promise<boolean> => {
//   try {
//     if (useSQLite) {
//       return await removeProductFromSQLite(productId);
//     } else {
//       return await removeProductFromSupabase(productId);
//     }
//   } catch (error) {
//     console.warn('Ошибка с основным источником данных, переключаемся на SQLite:', error);
//     switchToSQLite();
//     return await removeProductFromSQLite(productId);
//   }
// };

// // Универсальная функция для получения продукта по ID
// export const getProductById = async (id: string): Promise<Product | undefined> => {
//   try {
//     if (useSQLite) {
//       return await getProductByIdFromSQLite(id);
//     } else {
//       return await getProductByIdFromSupabase(id);
//     }
//   } catch (error) {
//     console.warn('Ошибка с основным источником данных, переключаемся на SQLite:', error);
//     switchToSQLite();
//     return await getProductByIdFromSQLite(id);
//   }
// };

// // Универсальная функция для получения продуктов по категории
// export const getProductsByCategory = async (category: string): Promise<Product[]> => {
//   try {
    
//     return await getProductsByCategoryFromSQLite(category);
    
//   } catch (error) {
//     console.warn('Ошибка с основным источником данных, переключаемся на SQLite:', error);
//     switchToSQLite();
//     return await getProductsByCategoryFromSQLite(category);
//   }
// };

// // Функция для поиска продуктов (только SQLite)
// export const searchProducts = async (query: string): Promise<Product[]> => {
//   try {
//     if (useSQLite) {
//       return await searchProductsInSQLite(query);
//     } else {
//       // Для Supabase используем простой поиск по названию
//       const allProducts = await fetchProductsFromSQLite(false);
//       return allProducts.filter(product => 
//         product.title.toLowerCase().includes(query.toLowerCase()) ||
//         product.description.toLowerCase().includes(query.toLowerCase())
//       );
//     }
//   } catch (error) {
//     console.warn('Ошибка с основным источником данных, переключаемся на SQLite:', error);
//     switchToSQLite();
//     return await searchProductsInSQLite(query);
//   }
// };

// // Функция для обновления остатков (только SQLite)
// export const updateProductStock = async (productId: string, newStock: number): Promise<boolean> => {
//   try {
//     if (useSQLite) {
//       return await updateProductStockInSQLite(productId, newStock);
//     } else {
//       // Для Supabase обновляем через существующий API
//       const product = await getProductByIdFromSupabase(productId);
//       if (product) {
//         product.stockQuantity = newStock;
//         const result = await addOrUpdateProductInSupabase(product);
//         return result.success;
//       }
//       return false;
//     }
//   } catch (error) {
//     console.warn('Ошибка с основным источником данных, переключаемся на SQLite:', error);
//     switchToSQLite();
//     return await updateProductStockInSQLite(productId, newStock);
//   }
// }; 