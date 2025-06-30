// Используется только Supabase/Postgres, SQLite удален

import { 
  fetchCategoriesFromSupabase, 
  addCategoryToSupabase, 
  updateCategoryImageInSupabase,
  removeCategoryFromSupabase,
  updateProductsCategoryInSupabase,
  getProductsByCategoryNameFromSupabase
} from './supabase/categoryApi';

// Определяем тип Category локально
export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  created_at?: string;
  updated_at?: string;
}

// Fallback данные для категорий
const fallbackCategories: Category[] = [
  {
    id: "electronics",
    name: "Электроника",
    description: "Современная электроника для дома и офиса",
    imageUrl: "/placeholder.svg",
    created_at: new Date().toISOString()
  },
  {
    id: "toys",
    name: "Игрушки",
    description: "Развивающие игрушки для детей",
    imageUrl: "/placeholder.svg",
    created_at: new Date().toISOString()
  },
  {
    id: "home",
    name: "Для дома",
    description: "Товары для дома и быта",
    imageUrl: "/placeholder.svg",
    created_at: new Date().toISOString()
  }
];

// Универсальная функция для получения всех категорий
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const supabaseCategories = await fetchCategoriesFromSupabase();
    // Преобразуем в формат для совместимости
    const categories = supabaseCategories.map(cat => ({
        id: cat.name, // Используем имя как ID для совместимости
        name: cat.name,
      description: '',
      imageUrl: cat.imageUrl,
      created_at: new Date().toISOString()
    }));
    return categories.length > 0 ? categories : fallbackCategories;
  } catch (error) {
    console.error('Ошибка при получении категорий из Supabase, используем fallback:', error);
    return fallbackCategories;
  }
};

// Универсальная функция для добавления категории
export const addCategory = async (name: string, imageUrl: string = "/placeholder.svg", description?: string): Promise<boolean> => {
  try {
    return await addCategoryToSupabase(name, imageUrl);
  } catch (error) {
    console.error('Ошибка при добавлении категории в Supabase:', error);
    return false;
  }
};

// Универсальная функция для обновления изображения категории
export const updateCategoryImage = async (name: string, imageUrl: string): Promise<boolean> => {
  try {
    return await updateCategoryImageInSupabase(name, imageUrl);
  } catch (error) {
    console.error('Ошибка при обновлении изображения категории в Supabase:', error);
    return false;
  }
};

// Универсальная функция для удаления категории
export const removeCategory = async (name: string): Promise<boolean> => {
  try {
    return await removeCategoryFromSupabase(name);
  } catch (error) {
    console.error('Ошибка при удалении категории из Supabase:', error);
    return false;
  }
};

// Универсальная функция для обновления категории товаров
export const updateProductsCategory = async (oldCategory: string, newCategory: string): Promise<boolean> => {
  try {
    return await updateProductsCategoryInSupabase(oldCategory, newCategory);
  } catch (error) {
    console.error('Ошибка при обновлении категории товаров в Supabase:', error);
    return false;
  }
};

// Универсальная функция для получения продуктов по категории
export const getProductsByCategoryName = async (category: string) => {
  try {
    return await getProductsByCategoryNameFromSupabase(category);
  } catch (error) {
    console.error('Ошибка при получении продуктов по категории из Supabase:', error);
    return [];
  }
};

// Получение категории по ID
export const getCategoryById = async (id: string): Promise<Category | undefined> => {
  try {
    // Для Supabase используем имя как ID
    const categories = await fetchCategoriesFromSupabase();
    const category = categories.find(cat => cat.name === id);
    if (category) {
      return {
        id: category.name,
        name: category.name,
        description: '',
        imageUrl: category.imageUrl,
        created_at: new Date().toISOString()
      };
    }
    return undefined;
  } catch (error) {
    console.error('Ошибка при получении категории по ID из Supabase:', error);
    return undefined;
  }
};

// Получение категории по имени
export const getCategoryByName = async (name: string): Promise<Category | undefined> => {
  try {
    // Для Supabase используем fetchCategories и фильтруем
    const categories = await fetchCategoriesFromSupabase();
    const category = categories.find(cat => cat.name === name);
    if (category) {
      return {
        id: category.name,
        name: category.name,
        description: '',
        imageUrl: category.imageUrl,
        created_at: new Date().toISOString()
      };
    }
    return undefined;
  } catch (error) {
    console.error('Ошибка при получении категории по имени из Supabase:', error);
    return undefined;
  }
};

// Обновление категории
export const updateCategory = async (id: string, updates: Partial<Category>): Promise<boolean> => {
  try {
    // Для Supabase обновляем только изображение
    if (updates.imageUrl) {
      return await updateCategoryImageInSupabase(id, updates.imageUrl);
    }
    return true;
  } catch (error) {
    console.error('Ошибка при обновлении категории в Supabase:', error);
    return false;
  }
};

// Получение количества продуктов в категории
export const getCategoryProductCount = async (categoryName: string): Promise<number> => {
  try {
    const products = await getProductsByCategoryNameFromSupabase(categoryName);
    return products.length;
  } catch (error) {
    console.error('Ошибка при получении количества продуктов в категории из Supabase:', error);
    return 0;
  }
}; 