import { Product } from "@/types/product";
import { addOrUpdateProductInSQLite } from "../../sqlite/productApi";
import { invalidateCache } from "./productCacheService";

// Import the getProductById directly from productServiceBase to avoid circular dependency
import { getProductById as getBaseProductById } from "../productServiceBase";

/**
 * Check if a product is in stock
 */
export const checkProductStock = async (productId: string, colorVariant?: string): Promise<boolean> => {
  try {
    const product = await getBaseProductById(productId);
    
    if (!product) {
      return false;
    }
    
    // Check specific color variant stock if specified
    if (colorVariant && product.colorVariants) {
      const variant = product.colorVariants.find(v => v.color === colorVariant);
      if (variant) {
        // Stock is available only if stockQuantity is defined and > 0
        const hasStock = (variant.stockQuantity || 0) > 0;
        return hasStock;
      }
      return false;
    }
    
    // Check main product stock - stock is available only if stockQuantity > 0
    const stockQuantity = product.stockQuantity || 0;
    const hasStock = stockQuantity > 0;
    return hasStock;
  } catch (error) {
    return false;
  }
};

/**
 * Decrease product stock
 */
export const decreaseProductStock = async (
  productId: string,
  quantity = 1,
  colorVariant?: string
): Promise<boolean> => {
  try {
   console.log(
      `Attempting to decrease stock for product ${productId}, quantity ${quantity}, color ${colorVariant || 'none'}`
    );

    // TODO: Implement stock decrease in SQLite
    console.log('Decreasing stock in SQLite:', { productId, quantity, colorVariant });
    
    await invalidateCache();
    return true;
  } catch (error) {
     console.error('Error decreasing product stock:', error);
    return false;
  }
};

/**
 * Update product stock directly (set to specific amount)
 */
export const updateProductStock = async (productId: string, newQuantity: number, colorVariant?: string): Promise<boolean> => {
  try {
    console.log(`Attempting to update stock for product ${productId} to ${newQuantity}, color ${colorVariant || 'none'}`);
    const product = await getBaseProductById(productId);
    
    if (!product) {
      console.error(`Product with ID ${productId} not found`);
      return false;
    }
    
    // Handle color variants
    if (colorVariant && product.colorVariants) {
      const variant = product.colorVariants.find(v => v.color === colorVariant);
      if (variant) {
        console.log(`Found color variant ${colorVariant}, current stock: ${variant.stockQuantity || 0}`);
        variant.stockQuantity = Math.max(0, newQuantity);
        console.log(`Updated variant stock to: ${variant.stockQuantity}`);
        
        // Update inStock status based on actual quantity - product is in stock if ANY variant has stock > 0
        const hasAnyVariantStock = product.colorVariants.some(v => (v.stockQuantity || 0) > 0);
        product.inStock = hasAnyVariantStock;
        
        // Update product with modified color variant
        const result = await addOrUpdateProductInSQLite({
          ...product,
          colorVariants: product.colorVariants
        });
        
        // Force refresh cache after stock update
        await invalidateCache();
        
        console.log(`Stock update result for variant: ${result.success ? 'Success' : 'Failed'}`);
        return result.success;
      }
    }
    
    // Handle main product stock
    console.log(`Updating main product stock. Current: ${product.stockQuantity || 0}`);
    product.stockQuantity = Math.max(0, newQuantity);
    
    // Always set inStock based on actual quantity - product is in stock only if stockQuantity > 0
    product.inStock = product.stockQuantity > 0;
    
    console.log("Setting product stock:", productId, "New quantity:", product.stockQuantity, "In stock:", product.inStock);
    
    // Update product with new stock quantity
    const result = await addOrUpdateProductInSQLite(product);
    
    // Force refresh cache after stock update
    await invalidateCache();
    
    console.log("Stock update result:", result);
    
    return result.success;
  } catch (error) {
    console.error("Error updating product stock:", error);
    return false;
  }
};
