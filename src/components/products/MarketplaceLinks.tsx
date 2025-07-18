import React from 'react';
import { Product } from "@/types/product";
import { trackGoal } from '@/utils/metrika';

interface MarketplaceLinksProps {
  product: Product;
  showLabels?: boolean;
  className?: string;
}

const MarketplaceLinks: React.FC<MarketplaceLinksProps> = ({ 
  product, 
  showLabels = false,
  className = "flex items-center gap-2 my-4 overflow-hidden" 
}) => {
  // Собираем все доступные маркетплейсы с новыми названиями свойств
  const availableMarkets = [
    { 
      name: 'wildberries', 
      url: product.wildberries_url || product.wildberriesUrl , 
      label: 'WB', 
      color: 'text-purple-700 hover:text-purple-800',
      image: 'e338f2d1-bca5-46f1-b305-fdc8cff079f6.png'
    },
    { 
      name: 'ozon', 
      url: product.ozon_url || product.ozonUrl , 
      label: 'Ozon', 
      color: 'text-blue-600 hover:text-blue-700',
      image: 'cdd6cfcc-2939-4048-ad14-0718ccb5108b.png'
    },
    { 
      name: 'avito', 
      url: product.avito_url || product.avitoUrl, 
      label: 'Авито', 
      color: 'text-green-600 hover:text-green-700',
      image: 'c9a01e33-cfba-4882-bd76-bf5242276fda.png'
    }
  ].filter(market => market.url && market.url.trim() !== '');

  // Если нет доступных маркетплейсов - ничего не показываем
  if (availableMarkets.length === 0) {
    return null;
  }
  
  const handleExternalLinkClick = (marketplaceName: string, url: string) => {
    trackGoal('marketplace_click', {
      product_id: product.id,
      product_name: product.title, 
      marketplace: marketplaceName,
      url: url
    });
  };

  return (
    <div className={className}>
      <span className="text-xs text-muted-foreground flex-shrink-0">
        Доступен на:
      </span>
      <div className="flex gap-1 min-w-0 flex-wrap">
        {availableMarkets.map((market) => (
          <a 
            key={market.name}
            href={market.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`flex items-center gap-1 text-sm ${market.color} flex-shrink-0`}
            title={`Открыть на ${market.label}`}
            onClick={() => handleExternalLinkClick(market.name, market.url || '')}
          >
            <div className="flex items-center justify-center w-5 h-5 flex-shrink-0 overflow-hidden">
              <img 
                src={`/lovable-uploads/${market.image}`}
                alt={market.label} 
                className="w-full h-full object-contain"
              />
            </div>
            {showLabels && <span className="truncate">{market.label}</span>}
          </a>
        ))}
      </div>
    </div>
  );
};

export default MarketplaceLinks;