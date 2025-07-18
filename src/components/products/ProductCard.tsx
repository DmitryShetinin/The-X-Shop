import React from "react";
import { Link } from "react-router-dom";
import { Product, ColorVariant } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import ProductColorOptions from "./ProductColorOptions";
import MarketplaceLinks from "./MarketplaceLinks";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface ProductCardProps {
  product: Product;
  className?: string;
  selectedColor?: string;
  onColorSelect?: (colorName: string, variant?: ColorVariant) => void;
  currentProduct?: Product;
  compact?: boolean;
  cartAvailable?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = "",
  selectedColor,
  onColorSelect,
  currentProduct = product,
  compact = false,
  cartAvailable = true
}) => {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlistItem } = useWishlist();

  const getStockStatus = (): { inStock: boolean; stockQuantity: number } => {
    let stockQuantity = currentProduct.stock_quantity || 0;
    
    if (selectedColor && currentProduct.colorVariants?.length) {
      const variant = currentProduct.colorVariants.find(v => v.color === selectedColor);
      if (variant) {
        stockQuantity = variant.stock_quantity || 0;
      }
    }
    
    return {
      inStock: stockQuantity > 0,
      stockQuantity
    };
  };

  const stockStatus = getStockStatus();

  const handleAddToCart = () => {
    const selectedVariant = selectedColor && currentProduct.colorVariants 
      ? currentProduct.colorVariants.find(v => v.color === selectedColor)
      : undefined;

    addItem({
      product: currentProduct,
      quantity: 1,
      color: selectedColor,
      selectedColorVariant: selectedVariant
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlistItem(product);
  };

  return (
    <div className={`group relative flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
         itemScope itemType="https://schema.org/Product">
      
      {/* Изображение товара */}
      <Link to={`/product/${product.id}`} className="block" itemProp="url">
        <AspectRatio ratio={compact ? 1 : 3/4} className="overflow-hidden rounded-t-lg bg-gray-50">
          <img
            src={`/images/${currentProduct.image_url}`}
            alt={product.title}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
            itemProp="image"
          />
        </AspectRatio>
      </Link>

      {/* Кнопка избранного */}
      <button
        onClick={handleToggleWishlist}
        className={`absolute top-3 right-3 p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all duration-200 z-10 ${
          isInWishlist(product.id) ? "text-red-500" : "text-gray-400"
        }`}
        aria-label={isInWishlist(product.id) ? "Удалить из избранного" : "Добавить в избранное"}
      >
        <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
      </button>

      {/* Контентная часть - растягивается на все доступное пространство */}
      <div className={`flex flex-col flex-grow ${compact ? "p-3" : "p-4"}`}>
        {/* Основной контент - растягивается */}
        <div className="flex-grow">
          <Link to={`/product/${product.id}`}>
            <h3 className={`font-medium text-gray-900 group-hover:text-gray-700 line-clamp-2 mb-2 ${
              compact ? "text-xs" : "text-sm"
            }`} itemProp="name">
              {product.title}
            </h3>
          </Link>

          {/* Варианты цветов */}
          {!compact && product.colors && product.colors.length > 0 && onColorSelect && (
            <ProductColorOptions
              product={product}
              selectedColor={selectedColor}
              onColorSelect={onColorSelect}
              className="mb-3"
            />
          )}

          {/* Цена */}
          <div className="flex items-center gap-2 mb-3" itemProp="offers" itemScope itemType="https://schema.org/Offer">
            <meta itemProp="priceCurrency" content="RUB" />
            <link itemProp="availability" href={stockStatus.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"} />
            <meta itemProp="url" content={`https://the-x.shop/product/${product.id}`} />
            
            {currentProduct.discount_price ? (
                <>
                  <span className={`font-bold text-gray-900 ${compact ? "text-sm" : "text-lg"}`} itemProp="price" content={String(currentProduct.discount_price)}>
                    {formatPrice(currentProduct.discount_price)}
                  </span>
                  {/* Отображаем старую цену только если discount_price меньше оригинальной */}
                  {currentProduct.discount_price < currentProduct.price && (
                    <span className={`text-gray-500 line-through ${compact ? "text-xs" : "text-sm"}`}>
                      {formatPrice(currentProduct.price)}
                    </span>
                  )}
                </>
              ) : (
                <span className={`font-bold text-gray-900 ${compact ? "text-sm" : "text-lg"}`} itemProp="price" content={String(currentProduct.price)}>
                  {formatPrice(currentProduct.price)}
                </span>
              )}
          </div>

          {/* Статус наличия */}
          {!compact && (
            <div className={`text-xs font-medium mb-3 ${
              stockStatus.inStock 
                ? "text-green-600" 
                : "text-red-500"
            }`}>
              {stockStatus.inStock 
                ? `В наличии · ${stockStatus.stockQuantity} шт` 
                : "Нет в наличии"}
            </div>
          )}

          {/* Ссылки на маркетплейсы */}
          <MarketplaceLinks product={currentProduct} className="mb-3" />
        </div>

        {/* Кнопки - всегда внизу */}
        <div className="mt-auto">
          {cartAvailable ? (
            <Button
              onClick={handleAddToCart}
              disabled={!stockStatus.inStock}
              className="w-full"
              size={compact ? "sm" : "sm"}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {stockStatus.inStock ? "В корзину" : "Нет в наличии"}
            </Button>
          ) : (
            <Link to={`/product/${product.id}`}>
              <Button className="w-full" size={compact ? "sm" : "sm"} variant="outline">
                Подробнее
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;