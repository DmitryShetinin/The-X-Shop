import React, { useEffect } from "react";
import { Product } from "@/types/product";
import ProductGrid from "@/components/products/ProductGrid";
import CatalogActiveFilters from "./CatalogActiveFilters";
import CatalogHeader from "./CatalogHeader";
import CatalogProductsInfo from "./CatalogProductsInfo";
import { SearchForm } from "./SearchForm";
import { useCatalogData } from '@/hooks/useCatalogData';
import { useActiveFilters } from '@/hooks/useCatalog/useActiveFilters';
import { useProductFiltering } from '@/hooks/useProductFiltering';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import DataDebugger from '@/components/debug/DataDebugger';

interface CatalogProductsSectionProps {
  categoryParam: string | null;
  searchTerm: string;
  colorParam: string | null;
  sortBy: string;
  setSortBy: (sort: string) => void;
  loading: boolean;
  filteredProducts: any[];
  availableCategories: string[];
  activeFiltersCount: number;
  inStockCount: number;
  outOfStockCount: number;
  handleSearchChange: (value: string) => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
  handleCategoryClick: (category: string) => void;
  handleColorFilter: (color: string) => void;
  handleClearAllFilters: () => void;
}

const CatalogProductsSection: React.FC<CatalogProductsSectionProps> = ({
  categoryParam,
  searchTerm,
  colorParam,
  sortBy,
  setSortBy,
  loading,
  filteredProducts,
  availableCategories,
  activeFiltersCount,
  inStockCount,
  outOfStockCount,
  handleSearchChange,
  handleSearchSubmit,
  handleCategoryClick,
  handleColorFilter,
  handleClearAllFilters
}) => {
  const isMobile = useIsMobile();
  const { allProducts, availableCategories: allCategories, categoryObjects, loading: catalogLoading, error, retry } = useCatalogData(categoryParam);
  
  // Используем правильные параметры для хуков
  const { activeFiltersCount: calculatedActiveFilters } = useActiveFilters({
    categoryParam,
    colorParam,
    priceRange: { min: 0, max: 500000000 },
    searchTerm
  });
  
  const { filteredProducts: allFilteredProducts, inStockCount: calculatedInStock, outOfStockCount: calculatedOutOfStock } = useProductFiltering({
    allProducts,
    searchTerm,
    priceRange: { min: 0, max: 500000000 },
    inStockOnly: false,
    sortBy,
    loading: catalogLoading,
    showColorVariants: true,
    colorParam
  });

  console.log('📊 CatalogProductsSection: Render state:', {
    allProducts: allProducts.length,
    filteredProducts: allFilteredProducts.length,
    loading: catalogLoading,
    error,
    categoryParam
  });

  // Отладочная информация
  useEffect(() => {
    console.log('🔍 CatalogProductsSection Debug Info:');
    console.log('📦 Filtered Products:', allFilteredProducts.length);
    console.log('📂 Available Categories:', allCategories);
    console.log('🎯 Category Param:', categoryParam);
    console.log('🔍 Search Term:', searchTerm);
    console.log('⚡ Loading:', catalogLoading);
    
    if (allFilteredProducts.length > 0) {
      console.log('📋 First Product Sample:', allFilteredProducts[0]);
    }
  }, [allFilteredProducts, allCategories, categoryParam, searchTerm, catalogLoading]);

  if (catalogLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Загрузка товаров...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center max-w-md">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={retry} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Компонент отладки - показываем только в режиме разработки */}
      {import.meta.env.DEV && <DataDebugger />}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">
            {categoryParam ? categoryParam : 'Все товары'}
          </h2>
          <span className="text-muted-foreground">
            ({allFilteredProducts.length} товаров)
          </span>
        </div>
      </div>

      {allFilteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {allProducts.length === 0 
              ? 'Товары не найдены' 
              : 'По вашему запросу ничего не найдено'
            }
          </p>
          {allProducts.length === 0 && (
            <Button onClick={retry} variant="outline">
              Обновить
            </Button>
          )}
        </div>
      ) : (
        <ProductGrid 
          products={allFilteredProducts}
          showAsColorVariants={true}
          columnsClass="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        />
      )}
    </div>
  );
};

export default CatalogProductsSection;
