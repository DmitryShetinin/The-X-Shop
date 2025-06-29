// Export from productData with the original name
export * from "./productData";

// Импортируем addCategory, updateCategoryImage, removeCategory, updateProductsCategory и getProductsByCategory из categoryData
import { addCategory, updateCategoryImage, removeCategory, updateProductsCategory, getProductsByCategory as getProductsByCategoryFromCategoryData } from './categoryData';
export { addCategory, updateCategoryImage, removeCategory, updateProductsCategory };

// Используем только один тип Category
import { Category } from '@/data/sqlite/database';
export type { Category };

import { Product } from '@/types/product';
import { fetchProductsFromSupabase, getProductsByCategoryFromSupabase } from './supabase/productApi';
import { fetchCategoriesFromSupabase } from './supabase/categoryApi';
import { fetchProductsFromSQLite, getProductsByCategoryFromSQLite } from './sqlite/productApi';
import { fetchCategoriesFromSQLite } from './sqlite/categoryApi';

// Экспортируем getCategoryProducts как алиас для getProductsByCategoryFromCategoryData после всех импортов
export const getCategoryProducts = getProductsByCategoryFromCategoryData;

// Определяем окружение
const isProduction = import.meta.env.PROD;
const isVercel = import.meta.env.VITE_VERCEL === '1' || (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app'));
const useSupabase = isProduction || isVercel;

console.log('🌍 Environment detection:', {
  NODE_ENV: import.meta.env.MODE,
  VERCEL: import.meta.env.VITE_VERCEL,
  useSupabase,
  isProduction,
  isVercel
});

/**
 * Универсальная функция для получения всех продуктов
 */
export const getActiveProducts = async (): Promise<Product[]> => {
  console.log('📦 getActiveProducts: Starting with', useSupabase ? 'Supabase' : 'SQLite');
  
  try {
    if (useSupabase) {
      const products = await fetchProductsFromSupabase();
      console.log(`✅ getActiveProducts: Supabase returned ${products.length} products`);
      return products;
    } else {
      const products = await fetchProductsFromSQLite();
      console.log(`✅ getActiveProducts: SQLite returned ${products.length} products`);
      return products;
    }
  } catch (error) {
    console.error('❌ getActiveProducts: Error with primary source:', error);
    
    // Fallback к альтернативному источнику
    try {
      if (useSupabase) {
        const products = await fetchProductsFromSQLite();
        console.log(`✅ getActiveProducts: SQLite fallback returned ${products.length} products`);
        return products;
      } else {
        const products = await fetchProductsFromSupabase();
        console.log(`✅ getActiveProducts: Supabase fallback returned ${products.length} products`);
        return products;
      }
    } catch (fallbackError) {
      console.error('❌ getActiveProducts: Both sources failed:', fallbackError);
      throw new Error('Не удалось загрузить товары ни из одного источника');
    }
  }
};

/**
 * Универсальная функция для получения продуктов по категории
 */
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  console.log('📂 getProductsByCategory: Starting with', useSupabase ? 'Supabase' : 'SQLite', 'for category:', category);
  
  try {
    if (useSupabase) {
      const products = await getProductsByCategoryFromSupabase(category);
      console.log(`✅ getProductsByCategory: Supabase returned ${products.length} products for category "${category}"`);
      return products;
    } else {
      const products = await getProductsByCategoryFromSQLite(category);
      console.log(`✅ getProductsByCategory: SQLite returned ${products.length} products for category "${category}"`);
      return products;
    }
  } catch (error) {
    console.error('❌ getProductsByCategory: Error with primary source:', error);
    
    // Fallback к альтернативному источнику
    try {
      if (useSupabase) {
        const products = await getProductsByCategoryFromSQLite(category);
        console.log(`✅ getProductsByCategory: SQLite fallback returned ${products.length} products for category "${category}"`);
        return products;
      } else {
        const products = await getProductsByCategoryFromSupabase(category);
        console.log(`✅ getProductsByCategory: Supabase fallback returned ${products.length} products for category "${category}"`);
        return products;
      }
    } catch (fallbackError) {
      console.error('❌ getProductsByCategory: Both sources failed:', fallbackError);
      throw new Error(`Не удалось загрузить товары категории "${category}" ни из одного источника`);
    }
  }
};

/**
 * Универсальная функция для получения всех категорий
 */
export const getAllCategories = async (): Promise<string[]> => {
  console.log('📂 getAllCategories: Starting with', useSupabase ? 'Supabase' : 'SQLite');
  
  try {
    if (useSupabase) {
      const categories = await fetchCategoriesFromSupabase();
      console.log(`✅ getAllCategories: Supabase returned ${categories.length} categories`);
      return categories;
    } else {
      const categories = await fetchCategoriesFromSQLite();
      const categoryNames = categories.map(cat => cat.name);
      console.log(`✅ getAllCategories: SQLite returned ${categoryNames.length} categories`);
      return categoryNames;
    }
  } catch (error) {
    console.error('❌ getAllCategories: Error with primary source:', error);
    // Fallback к альтернативному источнику
    try {
      if (useSupabase) {
        const categories = await fetchCategoriesFromSQLite();
        const categoryNames = categories.map(cat => cat.name);
        console.log(`✅ getAllCategories: SQLite fallback returned ${categoryNames.length} categories`);
        return categoryNames;
      } else {
        const categories = await fetchCategoriesFromSupabase();
        console.log(`✅ getAllCategories: Supabase fallback returned ${categories.length} categories`);
        return categories;
      }
    } catch (fallbackError) {
      console.error('❌ getAllCategories: Both sources failed:', fallbackError);
      throw new Error('Не удалось загрузить категории ни из одного источника');
    }
  }
};

/**
 * Универсальная функция для получения объектов категорий
 */
export const getCategoryObjects = async (): Promise<Category[]> => {
  console.log('📂 getCategoryObjects: Starting with', useSupabase ? 'Supabase' : 'SQLite');
  
  try {
    if (useSupabase) {
      const categories = await fetchCategoriesFromSupabase();
      // Преобразуем в формат Category (name - строка)
      const categoryObjects: Category[] = categories.map((cat, index) => ({
        id: (index + 1).toString(),
        name: cat,
        description: `Категория ${cat}`,
        imageUrl: '/placeholder.svg',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      console.log(`✅ getCategoryObjects: Supabase returned ${categoryObjects.length} category objects`);
      return categoryObjects;
    } else {
      const categories = await fetchCategoriesFromSQLite();
      console.log(`✅ getCategoryObjects: SQLite returned ${categories.length} category objects`);
      return categories;
    }
  } catch (error) {
    console.error('❌ getCategoryObjects: Error with primary source:', error);
    // Fallback к альтернативному источнику
    try {
      if (useSupabase) {
        const categories = await fetchCategoriesFromSQLite();
        console.log(`✅ getCategoryObjects: SQLite fallback returned ${categories.length} category objects`);
        return categories;
      } else {
        const categories = await fetchCategoriesFromSupabase();
        const categoryObjects: Category[] = categories.map((cat, index) => ({
          id: (index + 1).toString(),
          name: cat,
          description: `Категория ${cat}`,
          imageUrl: '/placeholder.svg',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
        console.log(`✅ getCategoryObjects: Supabase fallback returned ${categoryObjects.length} category objects`);
        return categoryObjects;
      }
    } catch (fallbackError) {
      console.error('❌ getCategoryObjects: Both sources failed:', fallbackError);
      throw new Error('Не удалось загрузить объекты категорий ни из одного источника');
    }
  }
};
