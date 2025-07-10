import { Category } from '@/data/products/categoryApi';

// Получить все категории из API
import { API_BASE_URL } from '@/types/variables';



export const fetchCategoriesFromPostgres = async (): Promise<Category[]> => {
  console.log("API_BASE_URL")
  console.log(API_BASE_URL)
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const categories = await response.json();
    console.log(`✅ fetchCategoriesFromPostgres: Loaded ${categories.length} categories from API`);
    return categories;
  } catch (error) {
    console.error('❌ fetchCategoriesFromPostgres: Error loading categories from API:', error);
    throw error;
  }
}; 