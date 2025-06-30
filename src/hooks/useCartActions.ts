import { useState } from "react";
import { CartItem } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { checkProductStock, decreaseProductStock } from "@/data/products/product/services/productStockService";

export function useCartActions() {
  const { toast } = useToast();

  // Function to find an existing item with the same product ID and variant
  const findExistingItemIndex = (items: CartItem[], newItem: CartItem): number => {
    return items.findIndex(
      (i) => 
        i.product.id === newItem.product.id && 
        i.color === newItem.color && 
        i.size === newItem.size
    );
  };

  const addItem = async (items: CartItem[], item: CartItem, setItems: React.Dispatch<React.SetStateAction<CartItem[]>>) => {
    try {
      const existingItemIndex = findExistingItemIndex(items, item);
      
      // Проверяем наличие товара на складе
      const stockAvailable = await checkProductStock(String(item.product.id), item.color);
      
      if (!stockAvailable) {
        toast({
          title: "Товар недоступен",
          description: "Недостаточно товара на складе или товар отсутствует",
          variant: "destructive"
        });
        return;
      }

      // Проверяем, не превышает ли общее количество в корзине доступный запас
      const currentQuantityInCart = existingItemIndex >= 0 ? items[existingItemIndex].quantity : 0;
      const newTotalQuantity = currentQuantityInCart + item.quantity;
      
      // Получаем информацию о доступном количестве
      let availableStock = 0;
      
      if (item.color && item.product.colorVariants?.length) {
        const variant = item.product.colorVariants.find(v => v.color === item.color);
        if (variant && variant.stockQuantity !== null && variant.stockQuantity !== undefined) {
          availableStock = Number(variant.stockQuantity);
        }
      } else if (item.product.stockQuantity !== null && item.product.stockQuantity !== undefined) {
        availableStock = Number(item.product.stockQuantity);
      } else if (item.product.in_stock) {
        availableStock = 999; // Если есть флаг in_stock, но нет точного количества
      }
      
      if (newTotalQuantity > availableStock) {
        toast({
          title: "Превышен лимит",
          description: `Доступно только ${availableStock} шт. товара`,
          variant: "destructive"
        });
        return;
      }

      setItems((prevItems) => {
        if (existingItemIndex >= 0) {
          // Товар уже есть в корзине, обновляем количество
          const newItems = [...prevItems];
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newItems[existingItemIndex].quantity + item.quantity,
          };
          return newItems;
        } else {
          // Товара нет в корзине, добавляем новый
          return [...prevItems, item];
        }
      });
      
      // Показываем уведомление об успешном добавлении
      const colorText = item.color ? ` (${item.color})` : '';
      toast({
        title: "Товар добавлен в корзину",
        description: `${item.product.title}${colorText} - ${item.quantity} шт.`
      });
      
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить товар в корзину. Попробуйте еще раз.",
        variant: "destructive"
      });
      throw error; // Пробрасываем ошибку для обработки в компоненте
    }
  };

  const removeItem = (itemId: string, color: string | undefined, setItems: React.Dispatch<React.SetStateAction<CartItem[]>>) => {
    setItems((prevItems) => {
      if (color) {
        // If color is specified, only remove items with that color
        return prevItems.filter(
          (item) => !(item.product.id === itemId && item.color === color)
        );
      } else {
        // Otherwise remove all items with the product ID
        return prevItems.filter((item) => item.product.id !== itemId);
      }
    });
    toast({
      title: "Товар удален из корзины"
    });
  };

  const updateQuantity = async (
    itemId: string, 
    quantity: number, 
    color: string | undefined,
    items: CartItem[],
    setItems: React.Dispatch<React.SetStateAction<CartItem[]>>
  ) => {
    if (quantity <= 0) {
      removeItem(itemId, color, setItems);
      return;
    }

    try {
      // Check product stock with the correct parameter types
      const stockAvailable = await checkProductStock(String(itemId), color);
      
      if (!stockAvailable) {
        toast({
          title: "Ошибка",
          description: "Недостаточно товара на складе",
          variant: "destructive"
        });
        return; // Don't update if not enough stock
      }

      setItems((prevItems) => {
        const itemIndex = color 
          ? prevItems.findIndex(item => item.product.id === itemId && item.color === color)
          : prevItems.findIndex(item => item.product.id === itemId);

        if (itemIndex === -1) return prevItems;
        
        const item = prevItems[itemIndex];
        
        const newItems = [...prevItems];
        newItems[itemIndex] = { ...item, quantity };
        return newItems;
      });
    } catch (error) {
      console.error("Error updating item quantity:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить количество товара",
        variant: "destructive"
      });
    }
  };

  // New function to decrease stock quantities for all items in cart
  const decreaseStockForItems = async (items: CartItem[]): Promise<boolean> => {
    try {
      console.log("Decreasing stock for all items in cart:", items);
      
      // Process each item in the cart
      for (const item of items) {
        console.log(`Decreasing stock for ${item.product.id}, quantity: ${item.quantity}, color: ${item.color || 'none'}`);
        
        // Decrease stock for this item
        const result = await decreaseProductStock(
          String(item.product.id),
          item.quantity,
          item.color
        );
        
        if (!result) {
          console.error(`Failed to decrease stock for product ${item.product.id}`);
          return false;
        }
      }
      
      console.log("All stock quantities updated successfully");
      return true;
    } catch (error) {
      console.error("Error decreasing stock for cart items:", error);
      return false;
    }
  };

  const clearCart = (setItems: React.Dispatch<React.SetStateAction<CartItem[]>>) => {
    setItems([]);
    toast({
      title: "Корзина очищена"
    });
  };

  return {
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    decreaseStockForItems
  };
}
