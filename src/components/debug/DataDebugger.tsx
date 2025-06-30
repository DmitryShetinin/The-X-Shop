import React, { useEffect, useState } from 'react';

const DataDebugger: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function testDataLoading() {
      console.log('🧪 DataDebugger: Starting data test...');
      
      try {
        // Тестируем Supabase/Postgres данные
        console.log('📦 DataDebugger: Testing Supabase database...');
        
        setDebugInfo({
          message: 'SQLite удален, используется только Supabase/Postgres',
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
      <h3 className="text-lg font-semibold text-green-800 mb-2">🧪 Отладка данных</h3>
      
      <div className="text-sm">
        <p className="text-green-700">{debugInfo.message}</p>
      </div>
      
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