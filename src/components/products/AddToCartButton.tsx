import React, { useState } from "react";
import { Product, ColorVariant } from "@/types/product";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface AddToCartButtonProps {
  product: Product;
  selectedColor?: string;
  selectedColorVariant?: ColorVariant;
  className?: string;
  compact?: boolean;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  selectedColor,
  selectedColorVariant,
  className = "",
  compact = false
}) => {
  const { addItem } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Проверка наличия товара
  const isInStock = () => {
    if (selectedColor && product.colorVariants?.length) {
      const variant = product.colorVariants.find(v => v.color === selectedColor);
      if (variant) {
        if (variant.stockQuantity !== undefined && variant.stockQuantity !== null) {
          return variant.stockQuantity > 0;
        }
        return Boolean(product.in_stock);
      }
    }
    
    if (product.stockQuantity !== undefined && product.stockQuantity !== null) {
      return product.stockQuantity > 0;
    }
    
    return Boolean(product.in_stock);
  };

  const handleAddToCart = async () => {
    if (!isInStock()) {
      toast.error("Товар недоступен для добавления в корзину");
      return;
    }

    setIsAddingToCart(true);
    
    try {
      await addItem({
        product,
        quantity: 1, // Всегда добавляем 1 штуку
        color: selectedColor,
        selectedColorVariant
      });
      
      toast.success("Товар добавлен в корзину");
      
    } catch (error) {
      console.error("Ошибка при добавлении в корзину:", error);
      toast.error("Ошибка при добавлении в корзину");
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (!isInStock()) {
    return (
      <Button
        disabled
        className={`w-full ${className}`}
        size={compact ? "sm" : "default"}
        variant="outline"
      >
        Нет в наличии
      </Button>
    );
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAddingToCart}
      className={`w-full ${className}`}
      size={compact ? "sm" : "default"}
    >
      {isAddingToCart ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Добавляем...
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4 mr-2" />
          В корзину
        </>
      )}
    </Button>
  );
};

export default AddToCartButton; 