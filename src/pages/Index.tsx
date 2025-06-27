
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SEOHead } from "@/components/seo/SEOHead";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import ProductsSection from "@/components/home/ProductsSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import { useHomeData } from "@/hooks/useHomeData";


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Генерируем случайный индекс
        const j = Math.floor(Math.random() * (i + 1));
        // Меняем местами элементы
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}




const Index = () => {
  const { bestsellers, newProducts, categories, categoryObjects, loading } = useHomeData();

  useEffect(() => {
    document.title = "The X Shop | Товары из Китая для вашего дома";
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead
        title="Главная"
        description="The X Shop: Товары из Китая для вашего дома. Минималистичный дизайн, высокое качество, доступные цены."
        keywords="товары из китая, дизайнерские товары, товары для дома, минимализм"
      />
      
      <Navbar />

      <main className="flex-grow" itemScope itemType="https://schema.org/WebPage">
        <HeroSection categories={categories} />
        <CategoriesSection categoryObjects={categoryObjects} loading={loading} />
        <ProductsSection 
          title="Бестселлеры" 
          products={shuffleArray(bestsellers)} 
          loading={loading} 
          className="bg-gray-50"
        />
        <ProductsSection 
          title="Новинки" 
          products={shuffleArray(newProducts)} 
          loading={loading}
        />
        <BenefitsSection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
