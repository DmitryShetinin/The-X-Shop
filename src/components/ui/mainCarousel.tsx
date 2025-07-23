import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaCreditCard } from 'react-icons/fa';
import './Carousel.css'

import MarketplaceLinks from "../products/MarketplaceLinks";
import { ColorVariant, Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import QuantitySelector from '../products/QuantitySelector';




interface ProductCardProps {
  product: Product;
  className?: string;
  selectedColor?: string;
  onColorSelect?: (colorName: string, variant?: ColorVariant) => void;
  compact?: boolean;
  cartAvailable?: boolean;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  
}

 //           src={`/images/${currentProduct.image_url}`}

function createSlidesFromProduct(product) {
 
  const slides = [];
  
  // Проверяем, является ли URL видео (простая проверка по расширению)
  const isVideo = (url) => {
  // Если url не строка или пустой — это не видео
  if (typeof url !== 'string' || !url.trim()) return false;

  // Проверяем расширения
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi'];
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };
 
  // Обрабатываем основное изображение (image_url)
  if (product.imageUrl) {
    slides.push({
      type: isVideo(product.imageUrl) ? 'video' : 'image',
      src: `/images/${product.imageUrl}`,
      alt: product.title,
      thumbnail:  `/images/${product.imageUrl}`
    });

  }
  
  // Обрабатываем дополнительные изображения (additional_images)
  if (product.additionalImages && product.additionalImages.length > 0) {
    product.additionalImages.forEach(img => {
      slides.push({
        type: isVideo(img) ? 'video' : 'image',
        src: `/images/${img}`,
        alt: product.title,
        thumbnail:  `/images/${img}`
      });
    });
  }



  return slides;
}

const Carousel: React.FC<ProductCardProps> = ({
  product,
 
  onColorSelect,
  selectedColor,
  quantity,
  onQuantityChange,
  compact = false,
  cartAvailable = true
}) => 
  {
 
  // Состояние для управления каруселью
   const modalVideoRef = useRef<HTMLVideoElement>(null);
  const slideVideosRef = useRef<(HTMLVideoElement | null)[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSlide, setModalSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const { addItem } = useCart();

  const getStockStatus = () => {
     let stockQuantity = product.stock_quantity || 0;

     if (selectedColor && product.colorVariants?.length) {
       const variant = product.colorVariants.find(v => v.color === selectedColor);
       if (variant) {
         stockQuantity = variant.stock_quantity || 0;
       }
     }

     return {
       inStock: stockQuantity > 0,
       stockQuantity
     };
  };

  // Добавление в корзину
  const handleAddToCart = () => {
    const selectedVariant = selectedColor && product.colorVariants 
      ? product.colorVariants.find(v => v.color === selectedColor)
      : undefined;

    addItem({
      product: product,
      quantity: quantity,
      color: selectedColor,
      selectedColorVariant: selectedVariant
    });
  };

 

//  const stockStatus = getStockStatus();
  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') || '0';
  };

  // Расчет скидки
  const discountPercentage = useMemo(() => {
    if (!product.discountPrice || !product.price) return 0;
    return Math.round((1 - product.discountPrice / product.price) * 100);
  }, [product]);
  
 
 
  const slides = createSlidesFromProduct(product)
    console.log("slides")
  console.log(slides)
  // Обработчики навигации
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Функции для модального окна
  const openModal = (index) => {
    setModalSlide(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextModalSlide = () => {
    setModalSlide((prev) => (prev + 1) % slides.length);
  };

  const prevModalSlide = () => {
    setModalSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Управление видео
  const toggleVideoPlay = () => {
    if (modalVideoRef.current) {
      if (modalVideoRef.current.paused) {
        modalVideoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        modalVideoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  const toggleVideoMute = () => {
    if (modalVideoRef.current) {
      modalVideoRef.current.muted = !modalVideoRef.current.muted;
      setIsVideoMuted(modalVideoRef.current.muted);
    }
  };

  // Автопрокрутка для изображений
  useEffect(() => {
    if (isModalOpen) return;
    
    const interval = setInterval(() => {
      if (slides[currentSlide].type === 'image') {
        nextSlide();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentSlide, isModalOpen]);

  // Обработка событий клавиатуры
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isModalOpen) {
        switch(e.key) {
          case 'ArrowLeft':
            prevModalSlide();
            break;
          case 'ArrowRight':
            nextModalSlide();
            break;
          case 'Escape':
            closeModal();
            break;
          case ' ':
            if (slides[modalSlide].type === 'video') {
              toggleVideoPlay();
              e.preventDefault();
            }
            break;
        }
      } else {
        switch(e.key) {
          case 'ArrowLeft':
            prevSlide();
            break;
          case 'ArrowRight':
            nextSlide();
            break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, modalSlide]);

  // Управление видео при смене слайдов
  useEffect(() => {
    slideVideosRef.current.forEach((video, index) => {
      if (video) {
        if (index === currentSlide) {
          video.play().catch(e => console.log("Автовоспроизведение заблокировано"));
        } else {
          video.pause();
        }
      }
    });
  }, [currentSlide]);

  

  return (
    <div className="app">
     
      
      <div className="product-container">
        <div className="gallery-section">
          <div className="gallery-container">
            <div className="main-carousel">
              {slides.map((slide, index) => (
                <div 
                  key={index}
                  className={`slide ${index === currentSlide ? 'active' : ''}`}
                  onClick={(e) => {
                    const target = e.target as HTMLElement; // Приведение типа к HTMLElement
                    if (!target.closest('.nav-btn')) {
                      openModal(index);
                    }
                  }}>
                  {slide.type === 'image' ? (
                    <img src={slide.src} alt={slide.alt} />
                  ) : (
                    <video 
                      ref={el => slideVideosRef.current[index] = el}
                      muted 
                      loop
                      playsInline
                      poster={slide.poster}
                    >
                      <source src={slide.src} type="video/mp4" />
                    </video>
                  )}
                </div>
              ))}
              
              <div className="carousel-nav">
                <button className="nav-btn prev-btn" onClick={prevSlide}>
                  <FaChevronLeft />
                </button>
                <button className="nav-btn next-btn" onClick={nextSlide}>
                  <FaChevronRight />
                </button>
              </div>
            </div>
            
            <div className="thumbnails">
              {slides.map((slide, index) => (
                <div 
                  key={index}
                  className={`thumbnail ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                >
                  {slide.type === 'image' ? (
                    <img src={slide.thumbnail} alt={`Миниатюра ${index + 1}`} />
                  ) : (
                    <>
                      <video muted playsInline>
                        <source src={slide.src} type="video/mp4" />
                      </video>
                      <div className="video-icon"><FaPlay /></div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="info-section">
          <div className="price-container">
            <h3 className="font-medium text-gray-900 group-hover:text-gray-700 line-clamp-2 mb-2 text-3xl">
                {product.title}
            </h3>
            <div className="current-price">   {formatPrice(product.price)} ₽</div>
            <div className="original-price">   {formatPrice(product.price)} ₽  <span className="discount">-{discountPercentage}%</span></div>
            <div className="ozon-card">
            
              Артикул: <span style={{fontWeight: 'bold'}}>{product.articleNumber} </span>
            </div>
          </div>

           <QuantitySelector 
              quantity={quantity} 
              onChange={onQuantityChange} 
              product={product} 
      
            />

          <MarketplaceLinks product={product} className="mb-3" />
          <div className="options">
            <div className="option-title">
              <span>Цвет Белый</span>
              <span style={{color: '#2196f3'}}>Все варианты </span>
            </div>
            <div className="color-option active">
              <div className="color-preview" style={{background: '#f0f0f0'}}></div>
              <div>Белый</div>
            </div>
            <div className="color-option">
              <div className="color-preview" style={{background: '#333'}}></div>
              <div>Черный</div>
            </div>
          </div>
          
      
          
          <button className="add-to-cart" onClick={handleAddToCart}>В корзину</button>
          <div className="delivery-info">Доставим с 3 августа</div>
        </div>
      </div>
      
      {isModalOpen && (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <span className="close-modal" onClick={closeModal}>&times;</span>
          <div className="modal-content">
            {slides[modalSlide].type === 'image' ? (
              <img src={slides[modalSlide].src} alt={slides[modalSlide].alt} />
            ) : (
              <video
                ref={modalVideoRef}
                autoPlay
                controls={false}
                playsInline
                poster={slides[modalSlide].poster}
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
              >
                <source src={slides[modalSlide].src} type="video/mp4" />
              </video>
            )}
          </div>
          
          <div className="modal-nav">
            <button className="modal-nav-btn modal-prev" onClick={prevModalSlide}>
              <FaChevronLeft />
            </button>
            <button className="modal-nav-btn modal-next" onClick={nextModalSlide}>
              <FaChevronRight />
            </button>
          </div>
          
          {slides[modalSlide].type === 'video' && (
            <div className="video-controls">
              <button className="control-btn play-btn" onClick={toggleVideoPlay}>
                {isVideoPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button className="control-btn volume-btn" onClick={toggleVideoMute}>
                {isVideoMuted ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Carousel;