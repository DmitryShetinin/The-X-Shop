import { fetchProductsFromSQLite } from "../sqlite/productApi";
import { Product } from "@/types/product";

// Кэш продуктов
let productsCache: Product[] = [];
let lastCacheUpdate = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

/**
 * Получает продукты из кэша
 */
export const getProductsCache = (): Product[] => {
  console.log('📦 getProductsCache: Returning cached products:', productsCache.length);
  return productsCache;
};

/**
 * Обновляет кэш продуктов, если прошло достаточно времени или принудительно
 */
export const refreshCacheIfNeeded = async (force = false): Promise<void> => {
  console.log('🔄 refreshCacheIfNeeded: Starting cache refresh...');
  const now = Date.now();
  const shouldRefresh = force || (now - lastCacheUpdate) > CACHE_DURATION;
  
  console.log('📊 refreshCacheIfNeeded: Cache status:', {
    shouldRefresh,
    force,
    timeSinceLastUpdate: now - lastCacheUpdate,
    cacheDuration: CACHE_DURATION,
    currentCacheSize: productsCache.length
  });
  
  if (!shouldRefresh && productsCache.length > 0) {
    console.log('✅ refreshCacheIfNeeded: Using existing cache');
    return;
  }
  
  try {
    console.log('📥 refreshCacheIfNeeded: Fetching products from SQLite...');
    const products = await fetchProductsFromSQLite();
    productsCache = products;
    lastCacheUpdate = now;
    console.log(`✅ refreshCacheIfNeeded: Cache updated with ${products.length} products`);
  } catch (error) {
    console.error('❌ refreshCacheIfNeeded: Error updating cache:', error);
    throw error;
  }
};

/**
 * Очищает кэш продуктов
 */
export const invalidateCache = (): void => {
  console.log('🗑️ invalidateCache: Clearing cache');
  productsCache = [];
  lastCacheUpdate = 0;
};
