import { Product } from "@/types/product";
import { getProductsCache, refreshCacheIfNeeded } from "../../cache/productCache";

// Fallback данные для демонстрации UI
const fallbackProducts: Product[] = [
  {
    id: "1",
    title: "Умные часы DT-8 Mini",
    description: "Современные умные часы с множеством функций",
    price: 2999,
    originalPrice: 3999,
    category: "Электроника",
    imageUrl: "/placeholder.svg",
    in_stock: true,
    stockQuantity: 10,
    rating: 4.5,
    reviewsCount: 128,
    archived: false,
    colorVariants: []
  },
  {
    id: "2", 
    title: "Детский планшет Android",
    description: "Безопасный планшет для детей с родительским контролем",
    price: 4999,
    originalPrice: 5999,
    category: "Электроника",
    imageUrl: "/placeholder.svg",
    in_stock: true,
    stockQuantity: 15,
    rating: 4.3,
    reviewsCount: 89,
    archived: false,
    colorVariants: []
  },
  {
    id: "3",
    title: "Беспроводные наушники Air Pro",
    description: "Наушники с активным шумоподавлением",
    price: 1999,
    originalPrice: 2499,
    category: "Электроника", 
    imageUrl: "/placeholder.svg",
    in_stock: true,
    stockQuantity: 25,
    rating: 4.7,
    reviewsCount: 256,
    archived: false,
    colorVariants: []
  },
  {
    id: "4",
    title: "Домашний проектор X9",
    description: "Мини проектор для просмотра фильмов дома",
    price: 8999,
    originalPrice: 10999,
    category: "Электроника",
    imageUrl: "/placeholder.svg", 
    in_stock: true,
    stockQuantity: 8,
    rating: 4.6,
    reviewsCount: 67,
    archived: false,
    colorVariants: []
  },
  {
    id: "5",
    title: "Детский фотоаппарат Q5",
    description: "Фотоаппарат для мгновенной печати",
    price: 3999,
    originalPrice: 4999,
    category: "Электроника",
    imageUrl: "/placeholder.svg",
    in_stock: true,
    stockQuantity: 12,
    rating: 4.4,
    reviewsCount: 45,
    archived: false,
    colorVariants: []
  }
];

/**
 * Gets all products from cache
 */
export const getAllProductsCached = async (): Promise<Product[]> => {
  try {
    await refreshCacheIfNeeded();
    const products = getProductsCache();
    return products.length > 0 ? products : fallbackProducts;
  } catch (error) {
    console.error("Error loading products from cache, using fallback:", error);
    return fallbackProducts;
  }
};

/**
 * Gets products by category from cache
 */
export const getProductsByCategory = async (
  category: string
): Promise<Product[]> => {
  try {
    await refreshCacheIfNeeded();
    const products = getProductsCache();
    const filteredProducts = products.filter(product => 
      product.category === category && !product.archived
    );
    return filteredProducts.length > 0 ? filteredProducts : fallbackProducts.filter(p => p.category === category);
  } catch (error) {
    console.error("Error loading products by category, using fallback:", error);
    return fallbackProducts.filter(p => p.category === category);
  }
};

/**
 * Gets active products (not archived)
 */
export const getActiveProducts = async (): Promise<Product[]> => {
  try {
    await refreshCacheIfNeeded();
    const products = getProductsCache();
    const activeProducts = products.filter(product => !product.archived);
    return activeProducts.length > 0 ? activeProducts : fallbackProducts;
  } catch (error) {
    console.error("Error loading active products, using fallback:", error);
    return fallbackProducts;
  }
};

/**
 * Gets bestseller products
 */
export const getBestsellers = async (limit = 5): Promise<Product[]> => {
  try {
    await refreshCacheIfNeeded();
    const allProducts = getProductsCache();
    const products = allProducts.length > 0 ? allProducts : fallbackProducts;
    return products.slice(0, limit);
  } catch (error) {
    console.error("Error loading bestsellers, using fallback:", error);
    return fallbackProducts.slice(0, limit);
  }
};

/**
 * Gets new products
 */
export const getNewProducts = async (limit = 5): Promise<Product[]> => {
  try {
    await refreshCacheIfNeeded();
    const allProducts = getProductsCache();
    const products = allProducts.length > 0 ? allProducts : fallbackProducts;
    return products.slice(0, limit);
  } catch (error) {
    console.error("Error loading new products, using fallback:", error);
    return fallbackProducts.slice(0, limit);
  }
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
      return fallbackProducts.slice(0, limit);
    }
    
    // Get all products in the same category
    const categoryProducts = (await getProductsByCategory(product.category))
      .filter(p => p.id !== productId && !p.archived);
    
    // Return a random selection of products from the same category
    return categoryProducts.sort(() => 0.5 - Math.random()).slice(0, limit);
  } catch (error) {
    console.error("Error getting related products, using fallback:", error);
    return fallbackProducts.slice(0, limit);
  }
};
