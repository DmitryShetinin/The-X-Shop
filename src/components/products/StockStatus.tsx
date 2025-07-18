import React from 'react';

interface StockStatusProps {
  inStock: boolean;
}

const StockStatus: React.FC<StockStatusProps> = ({ inStock }) => {
  // Определяем статус на основе inStock
  const status = {
    text: inStock ? "В наличии" : "Нет в наличии",
    className: inStock ? "text-green-600" : "text-red-500"
  };

  return (
    <div className={`${status.className} font-medium text-sm mb-4`}>
      {status.text}
    </div>
  );
};

export default StockStatus;

