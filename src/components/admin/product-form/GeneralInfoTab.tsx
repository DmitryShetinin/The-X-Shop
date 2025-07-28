
import React from "react";
import { Product } from "@/types/product";
import { ProductBasicInfo } from "./sections/ProductBasicInfo";
import { ProductPricing } from "./sections/ProductPricing";
import { ProductFlags } from "./sections/ProductFlags";
import { ProductImages } from "./sections/ProductImages";

interface GeneralInfoTabProps {
  formData: Partial<Product>;
  categories: string[];
  showNewCategoryInput: boolean;
  newCategory: string;
  setNewCategory: (value: string) => void;
  setShowNewCategoryInput: (value: boolean) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (value: string, name: string) => void;
  handleCheckboxChange: (checked: boolean, name: string) => void;
  setColor: (value: string) => void; 
  onMainImageFileSelected?: (file: File | null) => void;
  handleStockQuantityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const GeneralInfoTab = ({
  formData,
  categories,
  showNewCategoryInput,
  newCategory,
  setNewCategory,
  setShowNewCategoryInput,
  handleInputChange,
  handleSelectChange,
  handleCheckboxChange,
  setColor,
  onMainImageFileSelected,
  handleStockQuantityChange
}: GeneralInfoTabProps) => {
  
  return (
    <div className="space-y-6">
      {/* Main Product Information */}
      <ProductBasicInfo
        formData={formData}
        categories={categories}
        showNewCategoryInput={showNewCategoryInput}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        setShowNewCategoryInput={setShowNewCategoryInput}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        setColor={setColor}
      />

      {/* Product Pricing and Inventory */}
      <ProductPricing
        formData={formData}
        handleInputChange={handleInputChange}
        handleCheckboxChange={handleCheckboxChange}
        handleStockQuantityChange={handleStockQuantityChange}
      
      />

      {/* Product Flags */}
      <ProductFlags
        formData={formData}
        handleCheckboxChange={handleCheckboxChange}
      />

      {/* Product Images */}
       
    </div>
  );
};

export default GeneralInfoTab;
