import { sqliteDB } from '@/data/sqlite/database';
import { Product } from '@/types/product';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';

// Функция для получения всех продуктов из SQLite
export const fetchProductsFromSQLite = async (): Promise<Product[]> => {
  console.log('🔍 fetchProductsFromSQLite: Starting...');
  try {
    const products = await sqliteDB.getProducts();
    console.log(`✅ fetchProductsFromSQLite: Successfully loaded ${products.length} products`);
    return products;
  } catch (err) {
    console.error('❌ fetchProductsFromSQLite: Error loading products:', err);
    return [];
  }
};

// Функция для получения товара по ID
export const getProductByIdFromSQLite = async (id: string): Promise<Product | null> => {
  console.log(`🔍 getProductByIdFromSQLite: Looking for product with ID ${id}`);
  try {
    const products = await sqliteDB.getProducts();
    const product = products.find(p => p.id === id);
    if (product) {
      console.log(`✅ getProductByIdFromSQLite: Found product "${product.title}"`);
    } else {
      console.log(`❌ getProductByIdFromSQLite: Product with ID ${id} not found`);
    }
    return product || null;
  } catch (err) {
    console.error('❌ getProductByIdFromSQLite: Error loading product by ID:', err);
    return null;
  }
};

// // Функция для создания или обновления товара
// export const addOrUpdateProductInSQLite = async (product: Product): Promise<{ success: boolean, data?: any, error?: string }> => {
//   try {
//     const db = sqliteDB.getDatabase();
//     const run = promisify(db.run.bind(db));
//     const get = promisify(db.get.bind(db));

//     // Проверяем, существует ли товар
//     const existingProduct = await get('SELECT id FROM products WHERE id = ?', [product.id]);
    
//     const productData = {
//       id: product.id || uuidv4(),
//       name: product.title,
//       description: product.description,
//       price: product.price,
//       category: product.category,
//       images: sqliteDB.serializeJSON(product.imageUrl || []),
//       colors: sqliteDB.serializeJSON(product.colors || []),
//       specifications: sqliteDB.serializeJSON(product.specifications || {}),
//       stock: product.stockQuantity || 0,
//       archived: product.archived || false,
//       updated_at: new Date().toISOString()
//     };

//     if (existingProduct) {
//       // Обновляем существующий товар
//       await run(`
//         UPDATE products 
//         SET name = ?, description = ?, price = ?, category = ?, 
//             images = ?, colors = ?, specifications = ?, stock = ?, 
//             archived = ?, updated_at = ?
//         WHERE id = ?
//       `, [
//         productData.name,
//         productData.description,
//         productData.price,
//         productData.category,
//         productData.images,
//         productData.colors,
//         productData.specifications,
//         productData.stock,
//         productData.archived,
//         productData.updated_at,
//         productData.id
//       ]);
//     } else {
//       // Добавляем новый товар
//       await run(`
//         INSERT INTO products (id, name, description, price, category, images, colors, specifications, stock, archived, created_at, updated_at)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//       `, [
//         productData.id,
//         productData.name,
//         productData.description,
//         productData.price,
//         productData.category,
//         productData.images,
//         productData.colors,
//         productData.specifications,
//         productData.stock,
//         productData.archived,
//         new Date().toISOString(),
//         productData.updated_at
//       ]);
//     }

//     return { success: true, data: productData };
    
//   } catch (err) {
//     console.error('Ошибка при сохранении товара в SQLite:', err);
//     const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
//     return { success: false, error: errorMessage };
//   }
// };

// // Функция для архивирования товара
// export const archiveProductInSQLite = async (productId: string): Promise<boolean> => {
//   try {
//     const db = sqliteDB.getDatabase();
//     const run = promisify(db.run.bind(db));

//     await run('UPDATE products SET archived = TRUE, updated_at = ? WHERE id = ?', [
//       new Date().toISOString(),
//       productId
//     ]);
    
//     return true;
//   } catch (err) {
//     console.error('Ошибка при архивировании товара в SQLite:', err);
//     throw err;
//   }
// };

// // Функция для восстановления товара из архива
// export const restoreProductInSQLite = async (productId: string): Promise<boolean> => {
//   try {
//     const db = sqliteDB.getDatabase();
//     const run = promisify(db.run.bind(db));

//     await run('UPDATE products SET archived = FALSE, updated_at = ? WHERE id = ?', [
//       new Date().toISOString(),
//       productId
//     ]);
    
//     return true;
//   } catch (err) {
//     console.error('Ошибка при восстановлении товара из архива в SQLite:', err);
//     throw err;
//   }
// };

// // Функция для удаления товара
// export const removeProductFromSQLite = async (productId: string): Promise<boolean> => {
//   try {
//     const db = sqliteDB.getDatabase();
//     const run = promisify(db.run.bind(db));

//     await run('DELETE FROM products WHERE id = ?', [productId]);
    
//     return true;
//   } catch (err) {
//     console.error('Ошибка при удалении товара из SQLite:', err);
//     throw err;
//   }
// };

// // Функция для получения товаров по категории
// export const getProductsByCategoryFromSQLite = async (category: string): Promise<Product[]> => {
//   try {
//     const db = sqliteDB.getDatabase();
//     const all = promisify(db.all.bind(db));

//     const rows = await all('SELECT * FROM products WHERE category = ? AND archived = FALSE ORDER BY created_at DESC', [category]);
    
//     return rows.map((row: any) => ({
//       id: row.id,
//       name: row.name,
//       description: row.description || '',
//       price: row.price,
//       category: row.category,
//       images: sqliteDB.deserializeJSON(row.images || '[]'),
//       colors: sqliteDB.deserializeJSON(row.colors || '[]'),
//       specifications: sqliteDB.deserializeJSON(row.specifications || '{}'),
//       stock: row.stock || 0,
//       archived: Boolean(row.archived),
//       created_at: row.created_at,
//       updated_at: row.updated_at
//     }));
//   } catch (err) {
//     console.error('Ошибка при загрузке товаров по категории из SQLite:', err);
//     return [];
//   }
// };

// // Функция для поиска товаров
// export const searchProductsInSQLite = async (query: string): Promise<Product[]> => {
//   try {
//     const db = sqliteDB.getDatabase();
//     const all = promisify(db.all.bind(db));

//     const searchTerm = `%${query}%`;
//     const rows = await all(`
//       SELECT * FROM products 
//       WHERE (name LIKE ? OR description LIKE ?) AND archived = FALSE 
//       ORDER BY created_at DESC
//     `, [searchTerm, searchTerm]);
    
//     return rows.map((row: any) => ({
//       id: row.id,
//       name: row.name,
//       description: row.description || '',
//       price: row.price,
//       category: row.category,
//       images: sqliteDB.deserializeJSON(row.images || '[]'),
//       colors: sqliteDB.deserializeJSON(row.colors || '[]'),
//       specifications: sqliteDB.deserializeJSON(row.specifications || '{}'),
//       stock: row.stock || 0,
//       archived: Boolean(row.archived),
//       created_at: row.created_at,
//       updated_at: row.updated_at
//     }));
//   } catch (err) {
//     console.error('Ошибка при поиске товаров в SQLite:', err);
//     return [];
//   }
// };

// // Функция для обновления остатков товара
// export const updateProductStockInSQLite = async (productId: string, newStock: number): Promise<boolean> => {
//   try {
//     const db = sqliteDB.getDatabase();
//     const run = promisify(db.run.bind(db));

//     await run('UPDATE products SET stock = ?, updated_at = ? WHERE id = ?', [
//       newStock,
//       new Date().toISOString(),
//       productId
//     ]);
    
//     return true;
//   } catch (err) {
//     console.error('Ошибка при обновлении остатков товара в SQLite:', err);
//     throw err;
//   }
// }; 

// Упрощенные функции для работы с продуктами
// Эти функции будут реализованы позже, когда будет готова полная SQLite интеграция

export const addOrUpdateProductInSQLite = async (product: Product): Promise<{ success: boolean, data?: any, error?: string }> => {
  console.log('📝 addOrUpdateProductInSQLite: Adding/updating product:', product.title);
  // TODO: Реализовать добавление/обновление товара в SQLite
  return { success: true, data: product };
};

export const archiveProductInSQLite = async (productId: string): Promise<boolean> => {
  console.log('📦 archiveProductInSQLite: Archiving product:', productId);
  // TODO: Реализовать архивирование товара в SQLite
  return true;
};

export const restoreProductInSQLite = async (productId: string): Promise<boolean> => {
  console.log('🔄 restoreProductInSQLite: Restoring product:', productId);
  // TODO: Реализовать восстановление товара из архива в SQLite
  return true;
};

export const removeProductFromSQLite = async (productId: string): Promise<boolean> => {
  console.log('🗑️ removeProductFromSQLite: Removing product:', productId);
  // TODO: Реализовать удаление товара из SQLite
  return true;
};

export const getProductsByCategoryFromSQLite = async (category: string): Promise<Product[]> => {
  console.log(`🔍 getProductsByCategoryFromSQLite: Looking for products in category "${category}"`);
  try {
    const products = await sqliteDB.getProducts();
    const filteredProducts = products.filter(p => p.category === category && !p.archived);
    console.log(`✅ getProductsByCategoryFromSQLite: Found ${filteredProducts.length} products in category "${category}"`);
    return filteredProducts;
  } catch (err) {
    console.error('❌ getProductsByCategoryFromSQLite: Error loading products by category:', err);
    return [];
  }
}; 