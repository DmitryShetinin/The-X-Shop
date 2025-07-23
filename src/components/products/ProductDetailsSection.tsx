
import React from 'react';
import { Product } from "@/types/product";
 
import ProductPricing from "@/components/products/ProductPricing";
 
import ColorSelection from "@/components/products/ColorSelection";
import QuantitySelector from "@/components/products/QuantitySelector";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
 


const isVideo = (url: string) => /\.(mp4|webm|mov|avi)$/i.test(url);

const prepareMediaForCarousel = (mediaUrls: string[]) => {
  return mediaUrls.map(url => {
    const isVideoFile = isVideo(url);
    const filename = url.split('/').pop()?.trim() || ''; // Удаляем пробелы в конце, если есть
    
    return {
      type: isVideoFile ? 'video' : 'image',
      mediaUrl: url,
      thumbnailUrl: url, // Используем тот же URL для миниатюры
    };
  });
};


interface ProductDetailsSectionProps {
  product: Product;
  selectedColor?: string;
  displayPrice: number;
  displayArticleNumber?: string;
  onColorChange: (color: string) => void;
  onAddToCart: () => void;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

const ProductDetailsSection: React.FC<ProductDetailsSectionProps> = ({
  product,
  selectedColor,
  displayPrice,
  displayArticleNumber,
  onColorChange,
  onAddToCart,
  quantity,
  onQuantityChange
}) => {
  const selectedColorVariant = product?.colorVariants?.find(
    v => v.color === selectedColor
  );
 
  const localMedia = [
    `/images/${product.imageUrl}`,
    "/images/00099aa0-4965-4836-89c9-6a5533fe4e4e.png",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  ];

  const isProductInStock = () => {
    if (!product) return false;
    if (selectedColorVariant) {
      return selectedColorVariant.stockQuantity !== undefined && selectedColorVariant.stockQuantity > 0;
    }
    return product.stockQuantity !== undefined && product.stockQuantity > 0;
  };

  const getVariantImage = () => {
    if (selectedColor && product?.colorVariants) {
      const variant = product.colorVariants.find(v => v.color === selectedColor);
      if (variant?.imageUrl) {
        return variant.imageUrl;
      }
    }
    return product?.imageUrl || "";
  };
 
 
  const inStock = isProductInStock();
 
  return (
    <span>  </span>
    // <div className="grid md:grid-cols-2 gap-8">
      

    //   {/* Right side - product information */}
    //   <div className="space-y-6">
    //     {/* Product title and basic info */}
    //     <div>
    //       <h1 className="text-3xl font-bold mb-2" itemProp="name">{product.title}</h1>
          
    //       {/* Display article number if available */}
    //       {displayArticleNumber && (
    //         <div className="text-sm text-muted-foreground mb-2">
    //           Артикул: <span itemProp="sku">{displayArticleNumber}</span>
    //         </div>
    //       )}
    //     </div>
        
    //     {/* Add stock status indicator */}
      
        
    //     {/* Pricing */}
    //     <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
    //       <ProductPricing 
    //         product={product} 
    //         selectedColorVariant={selectedColorVariant}
    //         quantity={quantity} 
    //       />
    //       <meta itemProp="priceCurrency" content="RUB" />
 
    //       <link itemProp="availability" href={inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"} />
    //     </div>
        
      
         
        
    //     {/* Color selection */}
    //     <ColorSelection 
    //       product={product} 
    //       selectedColor={selectedColor} 
    //       onColorChange={onColorChange} 
    //     />

    //     {/* Quantity selection */}
    //      {/* <QuantitySelector 
    //       quantity={quantity} 
    //       onChange={onQuantityChange} 
    //       product={product} 
    //       selectedColorVariant={selectedColorVariant} 
    //     />  */}

    //     {/* Add to cart button */}
    //     <div className="pt-4">
    //       <Button 
    //         size="lg" 
    //         className="w-full"
    //         onClick={onAddToCart}
    //         disabled={!inStock}
    //       >
    //         <ShoppingCart className="mr-2 h-5 w-5" />
    //         {inStock ? `Купить за ${displayPrice} ₽` : "Нет в наличии"}
    //       </Button>
    //     </div>
    //   </div>
    // </div>
  );
};

export default ProductDetailsSection;
