// Получить все категории из API
export const fetchCategoriesFromPostgres = async (): Promise<Category[]> => {
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