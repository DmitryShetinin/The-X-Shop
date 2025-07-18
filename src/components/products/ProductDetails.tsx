import React from 'react';
import { Product } from "@/types/product";

interface ProductDetailsProps {
  product: Product;
  selectedTab?: string;
  setSelectedTab?: React.Dispatch<React.SetStateAction<string>>;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  // Функция для форматирования текста описания
  const formatDescription = (text: string) => {
    // Разбиваем текст на абзацы
    return text.split('\n\n').map((paragraph, index) => {
      // Проверяем, является ли абзац заголовком
      const isHeading = paragraph.startsWith('**') && paragraph.endsWith('**');
      
      // Форматируем заголовки
      if (isHeading) {
        return (
          <h3 
            key={index} 
            className="text-lg font-semibold mt-6 mb-3 text-gray-800"
          >
            {paragraph.slice(2, -2)}
          </h3>
        );
      }
      
      // Форматируем списки
      if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
        const items = paragraph.split('\n').filter(Boolean);
        return (
          <ul key={index} className="list-disc pl-5 space-y-1 my-3">
            {items.map((item, i) => (
              <li key={i} className="text-gray-700">
                {item.replace(/^[-*]\s+/, '')}
              </li>
            ))}
          </ul>
        );
      }
      
      // Обычные абзацы
      return (
        <p key={index} className="text-gray-700 mb-3 leading-relaxed">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-5 text-gray-900 border-b pb-3">
        Описание товара
      </h2>
      
      <div className="prose prose-lg max-w-none text-gray-800">
        {formatDescription(product.description)}
      </div>
      
      {/* Дополнительные характеристики */}
      {/* {product.specifications   && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4 text-gray-900">
            Характеристики
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {product.specifications.map((spec, index) => (
              <div key={index} className="flex border-b pb-2">
                <span className="text-gray-600 font-medium w-1/2">
                  {spec.key}:
                </span>
                <span className="text-gray-800 w-1/2">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ProductDetails;