import React from 'react';
import { Product } from "@/types/product";
import { ColorVariant } from "@/types/product";

interface ProductPricingProps {
  product: Product;
  selectedColorVariant?: ColorVariant | undefined;
  quantity : number
}

const ProductPricing: React.FC<ProductPricingProps> = ({ product, selectedColorVariant, quantity }) => {
  // Для варианта с цветом
  if (selectedColorVariant?.discountPrice) {
    const discountPercentage = Math.round(
      ((selectedColorVariant.price - selectedColorVariant.discountPrice) / selectedColorVariant.price) * 100
    );
  
    // Скрыть, если скидка 0%
    if (discountPercentage === 0) {
      return <span className="text-2xl font-bold">{selectedColorVariant.discountPrice} ₽</span>;
    }
    
    return (
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold">{selectedColorVariant.discountPrice} ₽</span>
        <span className="text-lg text-muted-foreground line-through">
          {selectedColorVariant.price} ₽
        </span>
        <span className="bg-red-500 text-white px-2 py-0.5 text-xs rounded">
          Скидка {discountPercentage}%
        </span>
      </div>
    );
  } 
  // Если у цвета нет скидки
  else if (selectedColorVariant) {
    return <span className="text-2xl font-bold">{selectedColorVariant.price} ₽</span>;
  } 
  // Для основного продукта
  else if (product.discountPrice) {
    const discountPercentage = Math.round(
      ((product.price - product.discountPrice) / product.price) * 100
    );
    
    if (discountPercentage === 0) {
      return <span className="text-2xl font-bold">{product.discountPrice * quantity} ₽</span>;
    }
    
    return (
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold">{product.discountPrice} ₽</span>
        <span className="text-lg text-muted-foreground line-through">
          {product.price} ₽
        </span>
        <span className="bg-red-500 text-white px-2 py-0.5 text-xs rounded">
          Скидка {discountPercentage}%
        </span>
      </div>
    );
  } 
  // Без скидки
  else {
    return <span className="text-2xl font-bold">{product.price} ₽</span>;
  }
};

export default ProductPricing;