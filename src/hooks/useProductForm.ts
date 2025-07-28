
import { useState, useEffect } from "react";
import { Product, ColorVariant } from "@/types/product";
import { toast } from "sonner";

interface UseProductFormProps {
  product: Partial<Product>;
  onSave: (product: Partial<Product>) => void;
}

export function useProductForm({ product, onSave }: UseProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>(product);
  const [newCategory, setNewCategory] = useState<string>("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("general");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Initialize form data whenever product changes
  useEffect(() => {
    setFormData(product);
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle number inputs
    if (type === "number") {
      setFormData({
        ...formData,
        [name]: value === "" ? "" : Number(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  // Fixed this function to properly handle category selection
  const handleSelectChange = (name: string, value: string) => {
    console.log(`Select changed: ${name} = ${value}`);
    
    if (name === "category" && value === "new") {
      // Show input for new category
      setShowNewCategoryInput(true);
      setNewCategory("");
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

 
  const handleMainImageUploaded = (files: File[]) => {
    setFormData(prev => ({
      ...prev,
      additional_images: files
    }));
  };

const handleAdditionalImagesChange = (files: (File | string)[]) => {
  if (files.length === 0) {
    setFormData({
      ...formData,
      imageUrl: null,
      additional_images: []
    });
    return;
  }

  // Функция для генерации уникального имени только для новых файлов
  const generateUniqueName = (file: File) => {
    const extension = file.name.split('.').pop() || '';
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 11);
    return `${timestamp}_${randomString}.${extension}`;
  };

  // Обрабатываем каждый элемент: для File генерируем новое имя, для string оставляем как есть
  const processedFiles = files.map(item => {
    if (typeof item === 'string') {
      // Уже существующий URL - возвращаем как есть
      return item;
    } else {
      // Новый файл - генерируем уникальное имя
      const newName = generateUniqueName(item);
      return new File([item], newName, {
        type: item.type,
        lastModified: item.lastModified
      });
    }
  });

  setFormData({
    ...formData,
    imageUrl: processedFiles[0],
    additional_images: processedFiles.slice(1)
  });
};

  const setColor = (variant: string) => {
    setFormData({
      ...formData,
      color: variant
    });
  };

  const handleRemoveColor = (colorToRemove: string) => {
    // Handling legacy colors array 
    const updatedColors = formData.color;
    
    setFormData({
      ...formData,
      color: updatedColors
    });
  };

  const handleRelatedColorProductsChange = (productIds: string[]) => {
    setFormData({
      ...formData,
      relatedColorProducts: productIds
    });
  };

  const validateForm = (): boolean => {
    // Validate required fields
    if (!formData.title) {
      toast.error("Необходимо указать название товара");
      setActiveTab("general");
      return false;
    }
    
    if (!formData.category && !newCategory) {
      toast.error("Необходимо указать категорию товара");
      setActiveTab("general");
      return false;
    }
    
    if (!formData.price || formData.price <= 0) {
      toast.error("Необходимо указать корректную цену товара");
      setActiveTab("general");
      return false;
    }
    
   
    
    
    return true;
  };

  const handleStockQuantityChangeAdapter = (value: number | undefined) => {
  setFormData(prev => ({
    ...prev,
    stockQuantity: value
  }));
};


  const handleStockQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value === "") {
      handleStockQuantityChangeAdapter(undefined);
      return;
    }
    
    const numValue = parseInt(value, 10);
    
    if (!isNaN(numValue)) {
      handleStockQuantityChangeAdapter(numValue);
  }
  };

  const validateAndSubmitForm = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // If new category was entered, use it
      const finalProduct = {
        ...formData,
        category: showNewCategoryInput && newCategory ? newCategory : formData.category
      };
      
      
      console.log("Submitting product with category:", finalProduct.category);
      await onSave(finalProduct);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Ошибка при сохранении товара");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
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
    setColor,
    handleRemoveColor,
    handleRelatedColorProductsChange,
    validateAndSubmitForm,
    setNewCategory,
    setShowNewCategoryInput,
    handleStockQuantityChange
  };
}
