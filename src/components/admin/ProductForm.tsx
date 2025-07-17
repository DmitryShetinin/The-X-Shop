
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralInfoTab from "./product-form/GeneralInfoTab";
import AdditionalInfoTab from "./product-form/AdditionalInfoTab";
import { useProductForm } from "@/hooks/useProductForm";
import { toast } from "sonner";
import { API_BASE_URL } from "@/types/variables";
 

interface ProductFormProps {
  product: Partial<Product>;
  categories: string[];
  onSave: (product: Partial<Product>) => void;
  onCancel: () => void;
}

const ProductForm = ({ product, categories, onSave, onCancel }: ProductFormProps) => {
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const {
    formData,
    newCategory,
    showNewCategoryInput,
    activeTab,
    isSubmitting,
    setActiveTab,
    handleInputChange,
    handleCheckboxChange,
    handleSelectChange,
    handleMainImageUploaded,
    handleAdditionalImagesChange,
    validateAndSubmitForm: baseValidateAndSubmitForm,
    setNewCategory,
    setShowNewCategoryInput
  } = useProductForm({ product, onSave: handleSave });

  async function handleSave(finalProduct: Partial<Product>) {
    // If a file is selected, upload it first
    if (mainImageFile) {
      try {
        const formData = new FormData();
        formData.append('file', mainImageFile);
        const response = await fetch(`${API_BASE_URL}/upload`, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) throw new Error('Ошибка загрузки файла');
        const { url } = await response.json();
        finalProduct.imageUrl = url;
      } catch (error: any) {
        toast.error('Ошибка загрузки изображения', {
          description: error.message || 'Произошла ошибка при загрузке файла',
        });
        return;
      }
    }
    await onSave(finalProduct);
  }

  // Adapter for file selection
  const handleMainImageFileSelected = (file: File | null) => {
    setMainImageFile(file);
  };

  // Create an adapter function to fix the parameter order for checkbox
  const handleCheckboxChangeAdapter = (checked: boolean, name: string) => {
    handleCheckboxChange(name, checked); // Swap the parameters to match the expected order
  };
  
  // Create an adapter function to fix the parameter order for select
  const handleSelectChangeAdapter = (value: string, name: string) => {
    handleSelectChange(name, value); // Swap the parameters to match the expected order
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="general" className="flex-1">Основная информация</TabsTrigger>
          <TabsTrigger value="additional" className="flex-1">Дополнительно</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="pt-4">
          <GeneralInfoTab
            formData={formData}
            categories={categories}
            showNewCategoryInput={showNewCategoryInput}
            newCategory={newCategory}
            setNewCategory={setNewCategory}
            setShowNewCategoryInput={setShowNewCategoryInput}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChangeAdapter} // Use the adapter function here
            handleCheckboxChange={handleCheckboxChangeAdapter} // Use the adapter function here
            handleMainImageUploaded={handleMainImageUploaded}
            handleAdditionalImagesChange={handleAdditionalImagesChange}
            onMainImageFileSelected={handleMainImageFileSelected}
          />
        </TabsContent>

        <TabsContent value="additional" className="pt-4">
          <AdditionalInfoTab
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChangeAdapter} // Use the adapter function here
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Отмена
        </Button>
        <Button onClick={baseValidateAndSubmitForm} disabled={isSubmitting}>
          {isSubmitting ? "Сохранение..." : (product.id ? "Сохранить изменения" : "Добавить товар")}
        </Button>
      </div>
    </div>
  );
};

export default ProductForm;
