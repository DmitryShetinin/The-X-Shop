import React, { useState } from 'react';
import { Product } from "@/types/product";
import ImageGallery from "@/components/products/ImageGallery";
import ProductVideo from "@/components/products/ProductVideo";
import ProductPricing from "@/components/products/ProductPricing";
import MarketplaceLinks from "@/components/products/MarketplaceLinks";
import StockStatus from "@/components/products/StockStatus";
import ColorSelection from "@/components/products/ColorSelection";
import QuantitySelector from "@/components/products/QuantitySelector";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface ProductDetailsSectionProps {
  product: Product;
  selectedColor?: string;
  displayPrice: number;
  hasStock: boolean;
  displayArticleNumber?: string;
  onColorChange: (color: string) => void;
  onAddToCart: () => Promise<void>;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

const ProductDetailsSection: React.FC<ProductDetailsSectionProps> = ({
  product,
  selectedColor,
  displayPrice,
  hasStock,
  displayArticleNumber,
  onColorChange,
  onAddToCart,
  quantity,
  onQuantityChange
}) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const selectedColorVariant = product?.colorVariants?.find(
    v => v.color === selectedColor
  );

  const getVariantImage = () => {
    if (selectedColor && product?.colorVariants) {
      const variant = product.colorVariants.find(v => v.color === selectedColor);
      if (variant?.imageUrl) {
        return variant.imageUrl;
      }
    }
    return product?.imageUrl || "";
  };

  const handleAddToCart = async () => {
    if (!hasStock || isAddingToCart) return;
    
    setIsAddingToCart(true);
    try {
      await onAddToCart();
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Left side - images */}
      <div>
        <ImageGallery 
          mainImage={getVariantImage()} 
          additionalImages={product.additionalImages} 
        />
        
        {/* Video if available */}
        {product.videoUrl && (
          <ProductVideo 
            videoUrl={product.videoUrl} 
            videoType={product.videoType} 
            imageUrl={product.imageUrl} 
          />
        )}
      </div>

      {/* Right side - product information */}
      <div className="space-y-6">
        {/* Product title and basic info */}
        <div>
          <h1 className="text-3xl font-bold mb-2" itemProp="name">{product.title}</h1>
          
          {/* Display article number if available */}
          {displayArticleNumber && (
            <div className="text-sm text-muted-foreground mb-2">
              Артикул: <span itemProp="sku">{displayArticleNumber}</span>
            </div>
          )}
        </div>
        
        {/* Add stock status indicator */}
        <StockStatus 
          product={product} 
          selectedColor={selectedColor} 
          hasStock={hasStock} 
        />
        
        {/* Pricing */}
        <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
          <ProductPricing 
            product={product} 
            selectedColorVariant={selectedColorVariant} 
          />
          <meta itemProp="priceCurrency" content="RUB" />
          <meta itemProp="price" content={displayPrice.toString()} />
          <link itemProp="availability" href={hasStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"} />
        </div>
        
        {/* Marketplace links */}
        <MarketplaceLinks product={product} />
        
        {/* Color selection */}
        <ColorSelection 
          product={product} 
          selectedColor={selectedColor} 
          onColorChange={onColorChange} 
        />

        {/* Quantity selection */}
        <QuantitySelector 
          quantity={quantity} 
          onChange={onQuantityChange} 
          product={product} 
          selectedColorVariant={selectedColorVariant} 
        />

        {/* Add to cart button */}
        <div className="pt-4 space-y-3">
          <Button 
            size="lg" 
            className="w-full"
            onClick={handleAddToCart}
            disabled={!hasStock || isAddingToCart}
          >
            {isAddingToCart ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Добавляем в корзину...
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-5 w-5" />
                {hasStock ? `Добавить в корзину за ${formatPrice(displayPrice)}` : "Нет в наличии"}
              </>
            )}
          </Button>
          
          {hasStock && (
            <div className="text-sm text-muted-foreground text-center">
              {quantity > 1 ? `Будет добавлено ${quantity} шт.` : "Будет добавлено 1 шт."}
              {selectedColor && ` (${selectedColor})`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSection;
