import { Category, fetchCategoriesFromSQLite, addCategoryToSQLite, removeCategoryFromSQLite, updateProductsCategoryInSQLite, updateCategoryImageInSQLite, getProductsByCategoryFromSQLite } from "./sqlite/categoryApi";

// Хранение текущих категорий
let categories: Category[] = [];
let categoriesLoaded = false;

// Функция для получения всех уникальных категорий
export const getAllCategories = async (): Promise<string[]> => {
  // Всегда обновляем категории из SQLite
  await loadCategoriesFromSQLite();
  
  // Возвращаем только имена категорий для совместимости с существующим кодом
  return categories.map(category => category.name);
};

// Функция для получения объектов категорий
export const getCategoryObjects = async (): Promise<Category[]> => {
  // Всегда обновляем категории из SQLite
  await loadCategoriesFromSQLite();
  
  return [...categories];
};

// Функция для загрузки категорий из SQLite
async function loadCategoriesFromSQLite(): Promise<void> {
  try {
    // Загружаем категории из SQLite без учета локального кэша
    const sqliteCategories = await fetchCategoriesFromSQLite();
   
    categories = sqliteCategories;
    categoriesLoaded = true;
    
    console.log("Категории загружены из SQLite:", categories);
  } catch (error) {
    console.error("Ошибка при загрузке категорий из базы данных:", error);
    categories = [];
  }
}

// Функция для добавления новой категории
export const addCategory = async (categoryName: string, imageUrl: string = "/placeholder.svg"): Promise<void> => {
  // Добавляем категорию в SQLite
  const added = await addCategoryToSQLite(categoryName, imageUrl);
  
  if (added) {
    // Перезагружаем категории из базы
    await loadCategoriesFromSQLite();
  }
};

// Функция для обновления изображения категории
export const updateCategoryImage = async (categoryName: string, imageUrl: string): Promise<void> => {
  // Обновляем изображение в SQLite
  const updated = await updateCategoryImageInSQLite(categoryName, imageUrl);
  
  if (updated) {
    // Перезагружаем категории из базы
    await loadCategoriesFromSQLite();
  }
};

// Функция для удаления категории
export const removeCategory = async (categoryName: string): Promise<boolean> => {
  // Проверяем, используется ли категория в продуктах
  const productsInCategory = await getProductsByCategory(categoryName);
  
  if (productsInCategory.length === 0) {
    // Если категория не используется, удаляем ее
    const removed = await removeCategoryFromSQLite(categoryName);
    
    if (removed) {
      // Перезагружаем категории из базы
      await loadCategoriesFromSQLite();
      return true;
    }
  }
  
  return false; // Если категория используется или не удалось удалить
};

// Функция для обновления продуктов при удалении категории
export const updateProductsCategory = async (oldCategory: string, newCategory: string): Promise<void> => {
  // Обновляем категорию для всех продуктов в SQLite
  const updated = await updateProductsCategoryInSQLite(oldCategory, newCategory);
  
  if (updated) {
    // Удаляем старую категорию после обновления продуктов
    await removeCategory(oldCategory);
  }
};

// Функция для получения продуктов по категории
export const getProductsByCategory = async (category: string) => {
  return await getProductsByCategoryFromSQLite(category);
};

// Загружаем категории при импорте модуля
loadCategoriesFromSQLite();
