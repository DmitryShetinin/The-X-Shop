import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './ColorChoose.css';

const ColorChoose = ({ 
  modelProducts = [], 
  selectedColorId,
  onColorSelect 
}) => {
  const colorOptionsRef = useRef(null);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  
  const itemWidth = 115; // Ширина элемента + отступ
  
  // Автоматический выбор цвета при загрузке
  useEffect(() => {
    if (modelProducts.length > 0) {
      const color = selectedColorId 
        ? modelProducts.find(p => p.id === selectedColorId) 
        : modelProducts[0];
      setSelectedColor(color || modelProducts[0]);
    }
  }, [modelProducts, selectedColorId]);

  // Обработчик выбора цвета
  const handleColorSelect = (product) => {
    setSelectedColor(product);
    if (onColorSelect) onColorSelect(product);
  };
  
  // Навигация
  const handlePrevClick = () => {
    setCurrentPosition(prev => Math.min(prev + itemWidth, 0));
  };
  
  const handleNextClick = () => {
    const maxScroll = -((modelProducts.length - 1) * itemWidth);
    setCurrentPosition(prev => Math.max(prev - itemWidth, maxScroll));
  };

  if (modelProducts.length === 0) return null;

  return (
    <div className="color-chooser">
      <div className="color-selection">
        <div className="color-options-container">
          <div 
            className="color-options" 
            ref={colorOptionsRef}
            style={{ transform: `translateX(${currentPosition}px)` }}
          >
            {modelProducts.map(product => (
              <div 
                key={product.id}
                className={`color-option-container ${
                  selectedColor?.id === product.id ? 'selected' : ''
                }`}
                onClick={() => handleColorSelect(product)}
              >
                <div className="color-image">
                  <img 
                    src={`/images/${product.image_url}`} 
                    alt={product.color} 
                  />
                </div>
                <div className="color-name">{product.color}</div>
              </div>
            ))}
          </div>
        </div>
        
        {modelProducts.length > 4 && (
          <div className="nav-buttons">
            <button 
              className="nav-button" 
              onClick={handlePrevClick}
              disabled={currentPosition === 0}
            >
              <FaChevronLeft />
            </button>
            <button 
              className="nav-button" 
              onClick={handleNextClick}
              disabled={currentPosition <= -((modelProducts.length - 1) * itemWidth)}
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorChoose;