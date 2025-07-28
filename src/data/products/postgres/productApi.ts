import { Product } from '@/types/product';
import { API_BASE_URL } from '@/types/variables';
 

// Получить все товары из API
export const fetchProductsFromPostgres = async (flag: string = 'true'): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products?includeArchived=${flag}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products = await response.json();
    console.log(`✅ fetchProductsFromPostgres: Loaded ${products.length} products from API`);
    return products;
  } catch (error) {
    console.error('❌ fetchProductsFromPostgres: Error loading products from API:', error);
    throw error;
  }
};

// Получить товары по категории из API
export const getProductsByCategoryFromPostgres = async (category: string): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/category/${encodeURIComponent(category)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products = await response.json();
    console.log(`✅ getProductsByCategoryFromPostgres: Loaded ${products.length} products for category "${category}" from API`);
    return products;
  } catch (error) {
    console.error('❌ getProductsByCategoryFromPostgres: Error loading products by category from API:', error);
    throw error;
  }
}; 

// Добавить или обновить товар
export const addOrUpdateProduct = async (product: Product): Promise<Product> => {
 
  const method = product.id ? 'PUT' : 'POST';
  const url = product.id ? `${API_BASE_URL}/products/${product.id}` : `${API_BASE_URL}/products`;
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error('Ошибка при сохранении товара');
  return await response.json();
};

// Удалить товар
export const deleteProduct = async (id: string): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE' });
  return response.ok;
};

// Архивировать/восстановить товар
export const archiveProduct = async (id: string, archive: boolean): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}/archive`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ archived: archive }),
  });
  return response.ok;
};

// Массовое удаление
export const bulkDeleteProducts = async (ids: string[]): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/products/bulk-delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
  return response.ok;
};

// Массовая архивация/восстановление
export const bulkArchiveProducts = async (ids: string[], archive: boolean): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/products/bulk-archive`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids, archive }),
  });
  return response.ok;
};

// Массовое объединение по modelName
export const mergeProductsByModelName = async (ids: string[]): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/products/bulk-merge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
  return response.ok;
}; 