import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CatalogLayout from "@/components/catalog/CatalogLayout";
import CatalogFilters from "@/components/catalog/CatalogFilters";
import CatalogProductsSection from "@/components/catalog/CatalogProductsSection";
import { SEOHead } from "@/components/seo/SEOHead";
import { Filter, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCatalogData } from "@/hooks/useCatalogData";
import { useProductFiltering } from "@/hooks/useProductFiltering";
import { useActiveFilters } from "@/hooks/useCatalog/useActiveFilters";
import { useUrlParams } from "@/hooks/useCatalog/useUrlParams";

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    categoryParam, 
    searchParam, 
    colorParam, 
    priceRange, 
    setPriceRange, 
    updatePriceInUrl 
  } = useUrlParams(searchParams, setSearchParams);
  
  const [searchTerm, setSearchTerm] = useState(searchParam || "");
  const [sortBy, setSortBy] = useState("in-stock");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Загрузка данных каталога
  const { allProducts, availableCategories, categoryObjects, loading, error, retry } = useCatalogData(categoryParam);
 
  // Фильтрация и сортировка продуктов
  const { filteredProducts, availableColors, inStockCount, outOfStockCount } = useProductFiltering({
    allProducts,
    searchTerm,
    priceRange,
    inStockOnly: false,
    sortBy,
    loading,
    showColorVariants: true,
    colorParam
  });

  // Calculate active filters count
  const { activeFiltersCount } = useActiveFilters({
    categoryParam,
    colorParam,
    priceRange,
    searchTerm
  });
  
  useEffect(() => {
    // Установка заголовка и мета-тегов для страницы
    let pageTitle = "Каталог товаров";
    let pageDescription = "Товары из Китая для вашего дома. Качественные товары по доступным ценам.";
    
    if (categoryParam) {
      pageTitle = `${categoryParam} - Каталог`;
      pageDescription = `Категория ${categoryParam} - товары из Китая для вашего дома по доступным ценам.`;
    }
    
    if (searchParam) {
      pageTitle = `Поиск: ${searchParam}`;
      pageDescription = `Результаты поиска по запросу "${searchParam}" - The X Shop`;
    }
    
    document.title = `${pageTitle} | The X Shop`;
  }, [categoryParam, searchParam]);

  useEffect(() => {
    // Update searchTerm when searchParam changes
    if (searchParam) {
      setSearchTerm(searchParam);
    } else if (searchParam === null) {
      setSearchTerm("");
    }
  }, [searchParam]);
  
  // Update URL when price range changes
  useEffect(() => {
    updatePriceInUrl();
  }, [priceRange, updatePriceInUrl]);

  const handleCategoryClick = (categoryId: string | null) => {
    if (categoryId) {
      searchParams.set("category", categoryId);
    } else {
      searchParams.delete("category");
    }
    setSearchParams(searchParams);
  };

  const handleColorFilter = (color: string | null) => {
    if (color) {
      searchParams.set("color", color);
    } else {
      searchParams.delete("color");
    }
    setSearchParams(searchParams);
  };

  const handlePriceChange = (type: "min" | "max", value: string) => {
    const numValue = parseInt(value, 10) || 0;
    setPriceRange((prev) => ({ ...prev, [type]: numValue }));
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchParams.set("search", searchTerm);
    } else {
      searchParams.delete("search");
    }
    setSearchParams(searchParams);
  };
  
  const handleClearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setPriceRange({ min: 0, max: 500000000 });
    setSearchTerm("");
  };

  // Находим объект категории по имени
  const findCategoryByName = (name: string) => {
    return categoryObjects.find(cat => cat.name === name) || { name, imageUrl: "/placeholder.svg" };
  };
  
  // Готовим мета-информацию в зависимости от фильтров
  const getSEOData = () => {
    let title = "Каталог товаров";
    let description = "Большой выбор товаров из Китая для вашего дома. Минималистичный дизайн, высокое качество, доступные цены.";
    
    if (categoryParam) {
      title = `${categoryParam} - каталог`;
      description = `Товары категории ${categoryParam}. Доступно ${filteredProducts.length} товаров.`;
    }
    
    if (searchParam) {
      title = `Поиск: ${searchParam}`;
      description = `Результаты поиска по запросу "${searchParam}" - найдено ${filteredProducts.length} товаров.`;
    }
    
    return { title, description };
  };
  
  const seoData = getSEOData();

  return (
    <CatalogLayout>
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={categoryParam ? `${categoryParam}, товары из Китая, минимализм` : "каталог товаров, товары из Китая, минималистичный дизайн"}
      />
      
      {/* Error Alert */}
      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <WifiOff className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={retry}
                className="ml-4 border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Повторить
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8" itemScope itemType="https://schema.org/CollectionPage">
        <meta itemProp="name" content={seoData.title} />
        <meta itemProp="description" content={seoData.description} />
        
        {/* Mobile filters toggle */}
        <div className="md:hidden mb-4">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <Filter className="h-4 w-4" />
            Фильтры {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>
        </div>

        <CatalogFilters 
          availableCategories={availableCategories}
          categoryParam={categoryParam}
          colorParam={colorParam}
          priceRange={priceRange}
          loading={loading}
          showMobileFilters={showMobileFilters}
          activeFiltersCount={activeFiltersCount}
          availableColors={availableColors}
          handleCategoryClick={handleCategoryClick}
          handleColorFilter={handleColorFilter}
          handlePriceChange={handlePriceChange}
          handleClearAllFilters={handleClearAllFilters}
          findCategoryByName={findCategoryByName}
        />

        <div itemScope itemType="https://schema.org/ItemList">
          <meta itemProp="numberOfItems" content={String(filteredProducts.length)} />
          <CatalogProductsSection
            categoryParam={categoryParam}
            searchTerm={searchTerm}
            colorParam={colorParam}
            availableCategories={availableCategories}
            loading={loading}
            filteredProducts={filteredProducts}
            inStockCount={inStockCount}
            outOfStockCount={outOfStockCount}
            activeFiltersCount={activeFiltersCount}
            sortBy={sortBy}
            handleSearchSubmit={handleSearchSubmit}
            handleSearchChange={handleSearchChange}
            setSortBy={setSortBy}
            handleCategoryClick={handleCategoryClick}
            handleColorFilter={handleColorFilter}
            handleClearAllFilters={handleClearAllFilters}
          />
        </div>
      </div>
    </CatalogLayout>
  );
};

export default Catalog;
