import { Product } from "@/types/product";
import { getProductsCache, refreshCacheIfNeeded } from "../../cache/productCache";

/**
 * Gets all products from cache
 */
export const getAllProductsCached = async (): Promise<Product[]> => {
  await refreshCacheIfNeeded();
  return getProductsCache();
};

/**
 * Gets products by category from cache
 */
export const getProductsByCategory = async (
  category: string
): Promise<Product[]> => {
  await refreshCacheIfNeeded();
  return getProductsCache().filter(product => 
    product.category === category && !product.archived
  );
};

/**
 * Gets active products (not archived)
 */
export const getActiveProducts = async (): Promise<Product[]> => {
  await refreshCacheIfNeeded();
  return getProductsCache().filter(product => !product.archived);
};

/**
 * Gets bestseller products
 */
export const getBestsellers = async (limit = 5): Promise<Product[]> => {
  await refreshCacheIfNeeded();
  const allProducts = getProductsCache();
  return allProducts.slice(0, limit);
};

/**
 * Gets new products
 */
export const getNewProducts = async (limit = 5): Promise<Product[]> => {
  await refreshCacheIfNeeded();
  const allProducts = getProductsCache();
  return allProducts.slice(0, limit);
};

/**
 * Gets related products for a product (same category, excluding the product itself)
 * @param productId ID of the product
 * @param limit Maximum number of related products to return
 * @returns Array of related products
 */
export const getRelatedProducts = async (productId: string, limit = 4): Promise<Product[]> => {
  try {
    // Use the import to avoid circular dependencies
    const product = await import("../productServiceSpecialized").then(module => module.getProductById(productId));
    
    if (!product) {
      return [];
    }
    
    // Get all products in the same category
    const categoryProducts = (await getProductsByCategory(product.category))
      .filter(p => p.id !== productId && !p.archived);
    
    // Return a random selection of products from the same category
    return categoryProducts.sort(() => 0.5 - Math.random()).slice(0, limit);
  } catch (error) {
    console.error("Error getting related products:", error);
    return [];
  }
};
