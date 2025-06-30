import { Product } from '@/types/product';

const API_BASE_URL = 'http://localhost:3001/api';

// Получить все товары из API
export const fetchProductsFromPostgres = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
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