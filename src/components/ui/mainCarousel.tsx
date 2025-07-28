import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import './Carousel.css';

import MarketplaceLinks from "../products/MarketplaceLinks";
import { ColorVariant, Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import QuantitySelector from '../products/QuantitySelector';
import ColorChoose from './colorChoose.jsx';
import { API_BASE_URL } from '@/types/variables';

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

function createSlidesFromProduct(product: Product) {
  const slides: any[] = [];
  
  const isVideo = (url: string) => {
    if (typeof url !== 'string' || !url.trim()) return false;
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };
 
  if (product.imageUrl) {
    slides.push({
      type: isVideo(product.imageUrl) ? 'video' : 'image',
      src: `/images/${product.imageUrl}`,
      alt: product.title,
      thumbnail: `/images/${product.imageUrl}`
    });
  }
  
  if (product.additionalImages && product.additionalImages.length > 0) {
    product.additionalImages.forEach(img => {
      slides.push({
        type: isVideo(img) ? 'video' : 'image',
        src: `/images/${img}`,
        alt: product.title,
        thumbnail: `/images/${img}`
      });
    });
  }

  return slides;
}

const useModelProducts = (productId) => {
  const [modelProducts, setModelProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modelName, setModelName] = useState('');

  useEffect(() => {
    const fetchModelProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/product-models/${productId}/products`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          // Преобразуем поля в camelCase
          const transformedProducts = data.products.map((p: any) => ({
            ...p,
            imageUrl: p.image_url,
            additionalImages: p.additional_images
          }));
          
          setModelProducts(transformedProducts);
          setModelName(data.model_name || '');
        } else {
          setError(data.error || 'Неизвестная ошибка');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchModelProducts();
    }
  }, [productId]);

  return { modelProducts, modelName, loading, error };
};

const Carousel: React.FC<ProductCardProps> = ({
  product,
  onColorSelect,
  selectedColor,
  quantity,
  onQuantityChange,
  compact = false,
  cartAvailable = true
}) => {
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const slideVideosRef = useRef<(HTMLVideoElement | null)[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSlide, setModalSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const { addItem } = useCart();
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const { 
    modelProducts, 
    modelName, 
    loading, 
    error 
  } = useModelProducts(product.id);
  
  // Состояние для текущего отображаемого продукта
  const [displayProduct, setDisplayProduct] = useState<Product>(product);
  
  // Эффект для плавного перехода при смене продукта
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 300); // Длительность анимации
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  // Слайды для текущего продукта
  const slides = useMemo(() => createSlidesFromProduct(displayProduct), [displayProduct]);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const discountPercentage = useMemo(() => {
    if (!product.discountPrice || !product.price) return 0;
    const discount = Math.round((1 - product.discountPrice / product.price) * 100);
    return discount > 0 ? discount : 0;
  }, [product]);

  const displayPrice = useMemo(() => {
    const format = (price: number) => price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') || '0';
    
    return discountPercentage > 0 
      ? {
          current: format(product.discountPrice || product.price),
          original: format(product.price)
        }
      : {
          current: format(product.price),
          original: null
        };
  }, [product, discountPercentage]);

  const handleAddToCart = () => {
 

    addItem({
      product: product,
      quantity: quantity,
      color: selectedColor,
   
    });
  };

  const openModal = useCallback((index: number) => {
    setModalSlide(index);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const nextModalSlide = useCallback(() => {
    setModalSlide(prev => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevModalSlide = useCallback(() => {
    setModalSlide(prev => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

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

  useEffect(() => {
    if (isModalOpen) return;
    
    const interval = setInterval(() => {
      if (slides.length > 0 && slides[currentSlide]?.type === 'image') {
        nextSlide();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentSlide, isModalOpen, slides, nextSlide]);

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

  const renderSlide = (slide: any, index: number) => (
    <div 
      key={index}
      className={`slide ${index === currentSlide ? 'active' : ''}`}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.nav-btn')) {
          openModal(index);
        }
      }}>
      {slide.type === 'image' ? (
        <img 
          src={index === currentSlide ? slide.src : 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"></svg>'}
          data-src={slide.src}
          alt={slide.alt}
          loading={index === currentSlide ? 'eager' : 'lazy'}
          className={index === currentSlide ? 'loaded' : ''}
        />
      ) : (
        <video 
          ref={el => slideVideosRef.current[index] = el}
          muted 
          loop
          playsInline
          preload={index === currentSlide ? 'auto' : 'none'}
        >
          <source src={slide.src} type="video/mp4" />
        </video>
      )}
    </div>
  );

  const renderThumbnail = (slide: any, index: number) => {
    if (index < 5) {
      return (
        <div 
          key={index}
          className={`thumbnail ${index === currentSlide ? 'active' : ''}`}
          onClick={() => goToSlide(index)}
        >
          {slide.type === 'image' ? (
            <img 
              src={slide.thumbnail} 
              alt={`Миниатюра ${index + 1}`} 
              loading="lazy"
            />
          ) : (
            <>
              <video muted playsInline preload="none">
                <source src={slide.src} type="video/mp4" />
              </video>
              <div className="video-icon"><FaPlay /></div>
            </>
          )}
        </div>
      );
    } else if (index === 5 && slides.length > 6) {
      return (
        <div 
          key="more"
          className="thumbnail more-thumbnails"
          onClick={() => openModal(5)}
        >
          {slides[5] && (
            <img 
              src={slides[5].thumbnail} 
              alt="Дополнительные изображения"
              className="blurred-thumbnail"
              loading="lazy"
            />
          )}
          <div className="more-count">+{slides.length - 5}</div>
        </div>
      );
    }
    return null;
  };

  // Обработчик выбора цвета
  const handleColorSelect = (selectedProduct) => {
    if (selectedProduct.id === displayProduct.id) return;
    
    // Активируем анимацию перехода
    setIsTransitioning(true);
    
    // Задержка для плавного перехода
    setTimeout(() => {
      setDisplayProduct(selectedProduct);
      setCurrentSlide(0);
    }, 50);
  };
  console.log(modelProducts )
  return (
    <div className="app">
      <div className="product-container">
        <div className="gallery-section">
          <div className="gallery-container">
            <div className={`main-carousel ${isTransitioning ? 'transitioning' : ''}`}>
              {slides.map((slide, index) => renderSlide(slide, index))}
              
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
              {slides.map((slide, index) => renderThumbnail(slide, index))}
            </div>
          </div>
        </div>
        
        <div className="info-section">
          <div className="info-content">
            <div className="price-container">
              <h3 className="font-medium text-gray-900 group-hover:text-gray-700 line-clamp-2 mb-2 text-3xl">
                  {displayProduct.title}
              </h3>
              <div className="current-price">{displayPrice.current} ₽</div>
              
              {discountPercentage > 0 && (
                <div className="original-price">
                  {displayPrice.original} ₽ <span className="discount">-{discountPercentage}%</span>
                </div>
              )}
              
              <div className="ozon-card">
                Артикул: <span style={{fontWeight: 'bold'}}>{displayProduct.article_number} </span>
              </div>
            </div>
              <div className="options">
                <ColorChoose 
                  modelProducts={modelProducts} 
                  selectedColorId={displayProduct.id}
                  onColorSelect={handleColorSelect}
                />
            </div>

            <QuantitySelector 
              quantity={quantity} 
              onChange={onQuantityChange} 
              product={displayProduct} 
            />

            <MarketplaceLinks product={displayProduct} className="mb-3" />
           
          </div>
          
          <div className="cart-section">
            <button className="add-to-cart" onClick={handleAddToCart}>В корзину</button>
            <div className="delivery-info">Доставим с 3 августа</div>
          </div>
        </div>
      </div>
      
      {isModalOpen  && (
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