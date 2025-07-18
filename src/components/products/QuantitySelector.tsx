import React from 'react';
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { ColorVariant } from "@/types/product";

interface QuantitySelectorProps {
  quantity: number;
  onChange: (value: number) => void;
  product: Product;
  selectedColorVariant?: ColorVariant;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ 
  quantity, 
  onChange, 
  product, 
  selectedColorVariant 
}) => {
  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      // Check against the selected color variant's stock if applicable
      if (selectedColorVariant?.stock_quantity !== undefined && value > selectedColorVariant.stock_quantity) {
        onChange(selectedColorVariant.stock_quantity);
        return;
      }
      
      // Otherwise check against the main product stock
      if (product.stock_quantity !== undefined && value > product.stock_quantity) {
        onChange(product.stock_quantity);
      } else {
        onChange(value);
      }
    }
  };

  return (
    <div>
      <h3 className="font-medium mb-2">Количество</h3>
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity <= 1}
        >
          -
        </Button>
        <span className="w-12 text-center">{quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleQuantityChange(quantity + 1)}
          // Check against variant stock if applicable
          disabled={
            (selectedColorVariant?.stock_quantity !== undefined && 
             quantity >= selectedColorVariant.stock_quantity) ||
            (product.stock_quantity !== undefined && 
             quantity >= product.stock_quantity)
          }
        >
          +
        </Button>
      </div>
    </div>
  );
};

export default QuantitySelector;
