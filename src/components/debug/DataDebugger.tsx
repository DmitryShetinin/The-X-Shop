import React, { useEffect, useState } from 'react';
import { sqliteDB } from '@/data/sqlite/database';
import { fetchProductsFromSQLite } from '@/data/products/sqlite/productApi';
import { fetchCategoriesFromSQLite } from '@/data/products/sqlite/categoryApi';

const DataDebugger: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function testDataLoading() {
      console.log('🧪 DataDebugger: Starting data test...');
      
      try {
        // Тестируем SQLite базу данных
        console.log('📦 DataDebugger: Testing SQLite database...');
        const products = await sqliteDB.getProducts();
        const categories = await sqliteDB.getCategory();
        
        // Тестируем API функции
        console.log('🔍 DataDebugger: Testing API functions...');
        const apiProducts = await fetchProductsFromSQLite();
        const apiCategories = await fetchCategoriesFromSQLite();
        
        setDebugInfo({
          sqliteProducts: products.length,
          sqliteCategories: categories.length,
          apiProducts: apiProducts.length,
          apiCategories: apiCategories.length,
          firstProduct: products[0] || null,
          firstCategory: categories[0] || null,
          timestamp: new Date().toISOString()
        });
        
        console.log('✅ DataDebugger: Data test completed successfully');
      } catch (error) {
        console.error('❌ DataDebugger: Error during data test:', error);
        setDebugInfo({
          error: error.message,
          timestamp: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    }
    
    testDataLoading();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">🧪 Тестирование данных...</h3>
        <div className="text-sm text-blue-600">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-green-800 mb-2">🧪 Отладка данных SQLite</h3>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-semibold text-green-700 mb-1">SQLite Database:</h4>
          <p>Продукты: {debugInfo.sqliteProducts || 0}</p>
          <p>Категории: {debugInfo.sqliteCategories || 0}</p>
        </div>
        
        <div>
          <h4 className="font-semibold text-green-700 mb-1">API Functions:</h4>
          <p>Продукты: {debugInfo.apiProducts || 0}</p>
          <p>Категории: {debugInfo.apiCategories || 0}</p>
        </div>
      </div>
      
      {debugInfo.firstProduct && (
        <div className="mt-3 p-2 bg-white rounded border">
          <h4 className="font-semibold text-green-700 mb-1">Первый продукт:</h4>
          <p className="text-xs">
            <strong>ID:</strong> {debugInfo.firstProduct.id}<br/>
            <strong>Название:</strong> {debugInfo.firstProduct.title}<br/>
            <strong>Цена:</strong> {debugInfo.firstProduct.price}₽<br/>
            <strong>Категория:</strong> {debugInfo.firstProduct.category}
          </p>
        </div>
      )}
      
      {debugInfo.firstCategory && (
        <div className="mt-3 p-2 bg-white rounded border">
          <h4 className="font-semibold text-green-700 mb-1">Первая категория:</h4>
          <p className="text-xs">
            <strong>ID:</strong> {debugInfo.firstCategory.id}<br/>
            <strong>Название:</strong> {debugInfo.firstCategory.name}<br/>
            <strong>Описание:</strong> {debugInfo.firstCategory.description}
          </p>
        </div>
      )}
      
      {debugInfo.error && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
          <h4 className="font-semibold text-red-700 mb-1">Ошибка:</h4>
          <p className="text-xs text-red-600">{debugInfo.error}</p>
        </div>
      )}
      
      <div className="mt-2 text-xs text-green-600">
        Время проверки: {debugInfo.timestamp}
      </div>
    </div>
  );
};

export default DataDebugger; 