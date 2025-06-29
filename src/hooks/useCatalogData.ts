import { useState, useEffect } from "react";
import { getProductsByCategory, getAllCategories, getCategoryObjects, getActiveProducts, Category } from "@/data/products";
import { Product } from "@/types/product";
 

export const useCatalogData = (categoryParam: string | null) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [categoryObjects, setCategoryObjects] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  // Загружаем данные при монтировании компонента или изменении категории
  useEffect(() => {
    async function loadData() {
      console.log('🚀 useCatalogData: Starting data load...');
      console.log('📊 useCatalogData: Category param:', categoryParam);
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('📥 useCatalogData: Loading categories and products...');
        
        // Загружаем категории и продукты с retry логикой
        const [categoriesData, categoryObjsData, productsData] = await Promise.allSettled([
          getAllCategories(),
          getCategoryObjects(),
          categoryParam ? getProductsByCategory(categoryParam) : getActiveProducts()
        ]);

        console.log('📋 useCatalogData: Categories data:', categoriesData);
        console.log('📂 useCatalogData: Category objects data:', categoryObjsData);
        console.log('📦 useCatalogData: Products data:', productsData);
        
        // Обрабатываем результаты
        if (categoriesData.status === 'fulfilled') {
          console.log('✅ useCatalogData: Categories loaded successfully:', categoriesData.value);
          setAvailableCategories(categoriesData.value);
        } else {
          console.warn('❌ useCatalogData: Failed to load categories:', categoriesData.reason);
          setAvailableCategories([]);
        }
        
        if (categoryObjsData.status === 'fulfilled') {
          console.log('✅ useCatalogData: Category objects loaded successfully:', categoryObjsData.value);
          setCategoryObjects(categoryObjsData.value);
        } else {
          console.warn('❌ useCatalogData: Failed to load category objects:', categoryObjsData.reason);
          setCategoryObjects([]);
        }
        
        if (productsData.status === 'fulfilled') {
          console.log('✅ useCatalogData: Products loaded successfully:', productsData.value.length);
          console.log('📋 useCatalogData: First product sample:', productsData.value[0]);
          setAllProducts(productsData.value);
          setRetryCount(0); // Сброс счетчика при успехе
        } else {
          console.error('❌ useCatalogData: Failed to load products:', productsData.reason);
          setAllProducts([]);
          setError('Не удалось загрузить товары. Проверьте подключение к интернету.');
          
          // Автоматический retry для мобильных устройств
          if (retryCount < 2) {
            console.log(`🔄 useCatalogData: Retrying in ${2000 * (retryCount + 1)}ms...`);
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, 2000 * (retryCount + 1)); // Увеличиваем задержку с каждым retry
          }
        }
        
      } catch (error) {
        console.error("❌ useCatalogData: Error during data load:", error);
        setError('Произошла ошибка при загрузке данных');
      } finally {
        setLoading(false);
        console.log('🏁 useCatalogData: Data loading completed');
      }
    }
    
    loadData();
  }, [categoryParam, retryCount]);

  // Функция для ручного retry
  const retry = () => {
    console.log('🔄 useCatalogData: Manual retry triggered');
    setRetryCount(prev => prev + 1);
  };

  console.log('📊 useCatalogData: Current state:', {
    allProducts: allProducts.length,
    availableCategories: availableCategories.length,
    categoryObjects: categoryObjects.length,
    loading,
    error,
    retryCount
  });

  return {
    allProducts,
    availableCategories,
    categoryObjects,
    loading,
    error,
    retry
  };
};
