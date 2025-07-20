import React, { useState, useEffect } from 'react';
import './GridCatalog.css';
import 'font-awesome/css/font-awesome.min.css';
import ProductCard from "./ProductCard";

const GridCatalog = ({ 
  products, 
  title, 
  showAsColorVariants = false, 
  limit,
  showExpand = false,
  columnsClass
}) => {
  // Конфигурация
  const itemsPerPage = 6;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  
  // Состояние
  const [currentPage, setCurrentPage] = useState(0);
  
  // Сброс страницы при изменении продуктов
  useEffect(() => {
    setCurrentPage(0);
  }, [products]);

  // Обработчики навигации
  const goToPage = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Получение продуктов для текущей страницы
  const getCurrentPageProducts = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, products.length);
    return products.slice(startIndex, endIndex);
  };

  // Создание точек пагинации
  const renderPaginationDots = () => {
    return Array.from({ length: totalPages }, (_, i) => (
      <div
        key={i}
        className={`pagination-dot ${i === currentPage ? 'active' : ''}`}
        onClick={() => goToPage(i)}
      />
    ));
  };

  return (
    <div className="catalog-container">
      <div className="catalog-header">
        {title && <h1>{title}</h1>}
      </div>
      
      <div className="catalog-wrapper">
        <div className="catalog-pages">
          <div className={`grid ${columnsClass || "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"} gap-4`}>
            {getCurrentPageProducts().map(product => (
              <ProductCard 
                key={product.id} 
                product={product}
                showAsColorVariants={showAsColorVariants}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="navigation">
        <button 
          className="nav-button" 
          onClick={handlePrev}
          disabled={currentPage === 0}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <button 
          className="nav-button" 
          onClick={handleNext}
          disabled={currentPage === totalPages - 1}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
      
      <div className="pagination">
        {renderPaginationDots()}
      </div>
      
      <div className="page-indicator">
        Страница <span id="currentPage">{currentPage + 1}</span> из <span id="totalPages">{totalPages}</span>
      </div>
    </div>
  );
};

export default GridCatalog;