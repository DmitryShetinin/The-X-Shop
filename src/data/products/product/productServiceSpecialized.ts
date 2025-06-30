import { Product } from "@/types/product";
 

// Import the services
import * as ProductCacheService from "./services/productCacheService";
import * as ProductColorService from "./services/productColorService";
import * as ProductFilterService from "./services/productFilterService";
import * as ProductStockService from "./services/productStockService";

// Export the services - avoid using ProductStockService.checkProductStock directly
// This fixes the circular dependency issue
export const invalidateCache = ProductCacheService.invalidateCache;
export const loadAllProducts = ProductCacheService.loadAllProducts;

export const linkProductsByColor = ProductColorService.linkProductsByColor;
export const getRelatedColorProducts = ProductColorService.getRelatedColorProducts;

export const getAllProductsCached = ProductFilterService.getAllProductsCached;
export const getProductsByCategory = ProductFilterService.getProductsByCategory;
export const getActiveProducts = ProductFilterService.getActiveProducts;
export const getBestsellers = ProductFilterService.getBestsellers;
export const getNewProducts = ProductFilterService.getNewProducts;
export const getRelatedProducts = ProductFilterService.getRelatedProducts;

export const checkProductStock = ProductStockService.checkProductStock;
export const decreaseProductStock = ProductStockService.decreaseProductStock;

const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Gets a product by ID from API
 */
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    console.log(`🔍 getProductById: Loading product with ID ${id} from API`);
    
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
 
    if (!response.ok) {
      if (response.status === 404) {
        console.log(`❌ getProductById: Product with ID ${id} not found`);
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const product = await response.json();
 
    console.log(`✅ getProductById: Loaded product "${product.title}" from API`);
    
    return product;
  } catch (error) {
    console.error('❌ getProductById: Error loading product from API:', error);
    
    return null;
  }
};
