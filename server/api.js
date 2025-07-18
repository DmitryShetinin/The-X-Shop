
"use strict";

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const WebSocket = require('ws');
const http = require('http');

const fs = require('fs');
const fsp = fs.promises; // Для асинхронных операций
const app = express();
const port = 3001;
const server = http.createServer(app);

const imagesDir = path.join(__dirname, '../public/images'); // ← ключевое изменение!
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}
 

const authRouter = require('./auth');
// Middleware
app.use(cors());
app.use(express.json());
 

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  password: 'kgLu6kV&',
  host: 'hujicimuris.beget.app',
  port: 5432,
  database: 'ITbashar239',
  ssl: false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// Function to parse JSON fields from PostgreSQL
function parseProductRow(row) {
  // Преобразуем JSON-строки в объекты/массивы
  if (typeof row.additional_images === 'string') {
    try { row.additional_images = JSON.parse(row.additional_images); } catch {}
  }
  if (typeof row.colors === 'string') {
    try { row.colors = JSON.parse(row.colors); } catch {}
  }
  if (typeof row.sizes === 'string') {
    try { row.sizes = JSON.parse(row.sizes); } catch {}
  }
  if (typeof row.specifications === 'string') {
    try { row.specifications = JSON.parse(row.specifications); } catch {}
  }
  if (typeof row.color_variants === 'string') {
    try { row.color_variants = JSON.parse(row.color_variants); } catch {}
  }
  
  // Обработка числовых полей
  if (row.stock_quantity !== null && row.stock_quantity !== undefined) {
    row.stock_quantity = parseInt(row.stock_quantity, 10) || 0;
  }
  if (row.price !== null && row.price !== undefined) {
    row.price = parseFloat(row.price) || 0;
  }
  if (row.discount_price !== null && row.discount_price !== undefined) {
    row.discount_price = parseFloat(row.discount_price) || 0;
  }
  if (row.rating !== null && row.rating !== undefined) {
    row.rating = parseFloat(row.rating) || 0;
  }
  
  // Обработка булевых полей
  if (row.in_stock !== null && row.in_stock !== undefined) {
    row.in_stock = Boolean(row.in_stock);
  }
  if (row.is_new !== null && row.is_new !== undefined) {
    row.is_new = Boolean(row.is_new);
  }
  if (row.archived !== null && row.archived !== undefined) {
    row.archived = Boolean(row.archived);
  }
  
  // Обработка color_variants если они есть
  if (row.color_variants && Array.isArray(row.color_variants)) {
    row.color_variants = row.color_variants.map(variant => ({
      ...variant,
      stockQuantity: variant.stockQuantity !== null && variant.stockQuantity !== undefined 
        ? parseInt(variant.stockQuantity, 10) || 0 
        : 0,
      price: variant.price !== null && variant.price !== undefined 
        ? parseFloat(variant.price) || 0 
        : 0,
      discountPrice: variant.discountPrice !== null && variant.discountPrice !== undefined 
        ? parseFloat(variant.discountPrice) || 0 
        : 0
    }));
  }
  
  return row;
}

 


// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ PostgreSQL connection error:', err);
    
  } else {
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
 
  }
});

// API Routes

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE archived = false');
    const parsedProducts = result.rows.map(parseProductRow);
    console.log(`✅ API: Loaded ${parsedProducts.length} products`);
    res.json(parsedProducts);
  } catch (error) {
    console.error('❌ API: Error loading products:', error);
    res.status(500).json({ error: 'Failed to load products' });
  }
});

// Get products by category
app.get('/api/products/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const result = await pool.query(
      'SELECT * FROM products WHERE category = $1 AND archived = false',
      [category]
    );
    const parsedProducts = result.rows.map(parseProductRow);
    console.log(`✅ API: Loaded ${parsedProducts.length} products for category "${category}"`);
    res.json(parsedProducts);
  } catch (error) {
    console.error('❌ API: Error loading products by category:', error);
    res.status(500).json({ error: 'Failed to load products by category' });
  }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories');
    console.log(`✅ API: Loaded ${result.rows.length} categories`);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ API: Error loading categories:', error);
    res.status(500).json({ error: 'Failed to load categories' });
  }
});

// Get single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1 AND archived = false', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const parsedProduct = parseProductRow(result.rows[0]);
    console.log(`✅ API: Loaded product with ID ${id}`);
    res.json(parsedProduct);
  } catch (error) {
    console.error('❌ API: Error loading product by ID:', error);
    res.status(500).json({ error: 'Failed to load product' });
  }
});

// Get total orders count (excluding archived)
app.get('/api/orders/count', async (req, res) => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM orders WHERE status != 'archived'");
    const totalOrders = parseInt(result.rows[0].count, 10);
    console.log(`✅ API: Loaded total orders count: ${totalOrders}`);
    res.json({ totalOrders });
  } catch (error) {
    console.error('❌ API: Error loading total orders count:', error);
    res.status(500).json({ error: 'Failed to load total orders count' });
  }
});

// Get total users count
app.get('/api/users/count', async (req, res) => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM users");
    const totalUsers = parseInt(result.rows[0].count, 10);
    console.log(`✅ API: Loaded total users count: ${totalUsers}`);
    res.json({ totalUsers });
  } catch (error) {
    console.error('❌ API: Error loading total users count:', error);
    res.status(500).json({ error: 'Failed to load total users count' });
  }
});

// Создание заказа
app.post('/api/orders', async (req, res) => {
  try {
    const {
      user_id = null,
      items,
      total,
      delivery_method,
      customer_name,
      customer_email,
      customer_phone,
      delivery_address
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Корзина пуста' });
    }
    if (!customer_name || !customer_email || !customer_phone || !delivery_address) {
      return res.status(400).json({ error: 'Не заполнены все обязательные поля' });
    }

    const { v4: uuidv4 } = require('uuid');
    const orderId = uuidv4();

    const insertQuery = `
      INSERT INTO orders (
        id, user_id, items, total, delivery_method, customer_name, customer_email, customer_phone, delivery_address, status, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()
      ) RETURNING *
    `;
    const values = [
      orderId,
      user_id,
      JSON.stringify(items),
      total,
      delivery_method,
      customer_name,
      customer_email,
      customer_phone,
      delivery_address,
      'new'
    ];

    const result = await pool.query(insertQuery, values);
    res.status(201).json({ success: true, order: result.rows[0] });
  } catch (error) {
    console.error('❌ API: Error creating order:', error);
    res.status(500).json({ error: 'Ошибка при создании заказа' });
  }
});

// Получить заказы пользователя по user_id
app.get('/api/orders/user/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    if (!user_id) {
      return res.status(400).json({ error: 'user_id обязателен' });
    }
    const result = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );
    // items могут быть строкой, парсим если нужно
    const orders = result.rows.map(order => {
      if (typeof order.items === 'string') {
        try { order.items = JSON.parse(order.items); } catch {}
      }
      return order;
    });
    res.json({ success: true, orders });
  } catch (error) {
    console.error('❌ API: Ошибка получения заказов пользователя:', error);
    res.status(500).json({ error: 'Ошибка при получении заказов пользователя' });
  }
});

// Получить все заказы (для админки)
app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    const orders = result.rows.map(order => {
      if (typeof order.items === 'string') {
        try { order.items = JSON.parse(order.items); } catch {}
      }
      return order;
    });
    res.json({ success: true, orders });
  } catch (error) {
    console.error('❌ API: Ошибка получения всех заказов:', error);
    res.status(500).json({ error: 'Ошибка при получении заказов' });
  }
});

// Обновить статус заказа
app.put('/api/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!orderId || !status) {
      return res.status(400).json({ error: 'orderId и status обязательны' });
    }
    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, orderId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }
    let order = result.rows[0];
    if (typeof order.items === 'string') {
      try { order.items = JSON.parse(order.items); } catch {}
    }
    res.json({ success: true, order });
  } catch (error) {
    console.error('❌ API: Ошибка обновления статуса заказа:', error);
    res.status(500).json({ error: 'Ошибка при обновлении статуса заказа' });
  }
});

// Обновить трекинг-номер и ссылку заказа
app.put('/api/orders/:orderId/tracking', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { trackingNumber, trackingUrl } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: 'orderId обязателен' });
    }
    const result = await pool.query(
      'UPDATE orders SET tracking_number = $1, tracking_url = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [trackingNumber, trackingUrl, orderId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }
    let order = result.rows[0];
    if (typeof order.items === 'string') {
      try { order.items = JSON.parse(order.items); } catch {}
    }
    res.json({ success: true, order });
  } catch (error) {
    console.error('❌ API: Ошибка обновления трекинга заказа:', error);
    res.status(500).json({ error: 'Ошибка при обновлении трекинга заказа' });
  }
});

app.use('/api/auth', authRouter);

// Эндпоинт для проверки ролей пользователя
app.post('/api/has-role', async (req, res) => {
  try {
    const { user_id, role } = req.body;
    if (!user_id || !role) {
      return res.status(400).json({ error: 'user_id и role обязательны' });
    }
    const result = await pool.query(
      'SELECT role, is_super_admin FROM user_roles WHERE user_id = $1 AND role = $2 LIMIT 1',
      [user_id, role]
    );
    const row = result.rows[0];
    const hasRole = !!row;
    const isSuperAdmin = row ? !!row.is_super_admin : false;
    res.json({ has_role: hasRole, is_super_admin: isSuperAdmin });
  } catch (error) {
    console.error('❌ API: Ошибка проверки роли:', error);
    res.status(500).json({ error: 'Ошибка при проверке роли' });
  }
});

// Эндпоинт для получения всех ролей пользователя
app.get('/api/user-roles/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    
    const result = await pool.query(
      'SELECT role FROM user_roles WHERE user_id = $1',
      [user_id]
    );
    
    const roles = result.rows.map(row => row.role);
    console.log(`✅ API: Роли пользователя ${user_id}: ${roles.join(', ')}`);
    res.json({ roles });
  } catch (error) {
    console.error('❌ API: Ошибка получения ролей:', error);
    res.status(500).json({ error: 'Ошибка при получении ролей' });
  }
});

// Эндпоинт для назначения роли пользователю
app.post('/api/assign-role', async (req, res) => {
  try {
    const { user_id, role } = req.body;
    
    if (!user_id || !role) {
      return res.status(400).json({ error: 'user_id и role обязательны' });
    }
    
    const result = await pool.query(
      'INSERT INTO user_roles (user_id, role) VALUES ($1, $2) ON CONFLICT (user_id, role) DO NOTHING RETURNING *',
      [user_id, role]
    );
    
    if (result.rows.length > 0) {
      console.log(`✅ API: Роль ${role} назначена пользователю ${user_id}`);
      res.json({ success: true, role: result.rows[0] });
    } else {
      console.log(`ℹ️ API: Роль ${role} уже назначена пользователю ${user_id}`);
      res.json({ success: true, message: 'Роль уже назначена' });
    }
  } catch (error) {
    console.error('❌ API: Ошибка назначения роли:', error);
    res.status(500).json({ error: 'Ошибка при назначении роли' });
  }
});

// Получить всех пользователей
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error('❌ API: Ошибка получения пользователей:', error);
    res.status(500).json({ error: 'Ошибка при получении пользователей' });
  }
});

// Создать товар
app.post('/api/products', async (req, res) => {
  try {
    const product = req.body;
    const { v4: uuidv4 } = require('uuid');
    const id = product.id || uuidv4();
    const insertQuery = `
      INSERT INTO products (
        id, title, description, price, discount_price, category, image_url, additional_images, rating, in_stock, colors, sizes, country_of_origin, specifications, is_new, is_bestseller, article_number, barcode, stock_quantity, color_variants, archived, video_url, video_type, material, model_name
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25
      ) RETURNING *
    `;
    const values = [
      id,
      product.title,
      product.description,
      product.price,
      product.discountPrice || product.discount_price,
      product.category,
      product.imageUrl || product.image_url,
      JSON.stringify(product.additionalImages || product.additional_images || []),
      product.rating,
      product.inStock !== undefined ? product.inStock : true,
      JSON.stringify(product.colors || []),
      JSON.stringify(product.sizes || []),
      product.countryOfOrigin || product.country_of_origin,
      JSON.stringify(product.specifications || {}),
      product.isNew || false,
      product.isBestseller || false,
      product.articleNumber || product.article_number,
      product.barcode,
      product.stockQuantity || product.stock_quantity || 0,
      JSON.stringify(product.colorVariants || product.color_variants || []),
      product.archived || false,
      product.videoUrl || '',
      product.videoType || '',
      product.material || '',
      product.modelName || ''
    ];
    const result = await pool.query(insertQuery, values);
    res.status(201).json(parseProductRow(result.rows[0]));
  } catch (error) {
    console.error('❌ API: Error creating product:', error);
    res.status(500).json({ error: 'Ошибка при создании товара' });
  }
});

// Обновить товар
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = req.body;
    const updateQuery = `
      UPDATE products SET
        title = $2, description = $3, price = $4, discount_price = $5, category = $6, image_url = $7, additional_images = $8, rating = $9, in_stock = $10, colors = $11, sizes = $12, country_of_origin = $13, specifications = $14, is_new = $15, is_bestseller = $16, article_number = $17, barcode = $18, stock_quantity = $19, color_variants = $20, archived = $21, video_url = $22, video_type = $23, material = $24, model_name = $25
      WHERE id = $1 RETURNING *
    `;
    const values = [
      id,
      product.title,
      product.description,
      product.price,
      product.discountPrice || product.discount_price,
      product.category,
      product.imageUrl || product.image_url,
      JSON.stringify(product.additionalImages || product.additional_images || []),
      product.rating,
      product.inStock !== undefined ? product.inStock : true,
      JSON.stringify(product.colors || []),
      JSON.stringify(product.sizes || []),
      product.countryOfOrigin || product.country_of_origin,
      JSON.stringify(product.specifications || {}),
      product.isNew || false,
      product.isBestseller || false,
      product.articleNumber || product.article_number,
      product.barcode,
      product.stockQuantity || product.stock_quantity || 0,
      JSON.stringify(product.colorVariants || product.color_variants || []),
      product.archived || false,
      product.videoUrl || '',
      product.videoType || '',
      product.material || '',
      product.modelName || ''
    ];
    const result = await pool.query(updateQuery, values);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(parseProductRow(result.rows[0]));
  } catch (error) {
    console.error('❌ API: Error updating product:', error);
    res.status(500).json({ error: 'Ошибка при обновлении товара' });
  }
});
 
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Получаем товар, чтобы узнать имя файла изображения
    const productResult = await pool.query(
      'SELECT image_url FROM products WHERE id = $1', 
      [id]
    );
    
    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const imageUrl = productResult.rows[0].image_url;
    
    // Удаляем запись из БД
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    
    // Удаляем файл изображения, если он существует
    if (imageUrl) {
      const imagePath = path.join(imagesDir, imageUrl);
      
      try {
        await fsp.unlink(imagePath);
        console.log(`🗑️  Изображение удалено: ${imageUrl}`);
      } catch (fileError) {
        // Игнорируем ошибку "файл не найден"
        if (fileError.code !== 'ENOENT') {
          console.error(`⚠️ Ошибка удаления файла ${imageUrl}:`, fileError);
        }
      }
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('❌ API: Error deleting product:', error);
    res.status(500).json({ error: 'Ошибка при удалении товара' });
  }
});

// Массовое удаление товаров с удалением изображений
app.post('/api/products/bulk-delete', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'ids required' });
    }
    
    // Получаем все изображения для удаляемых товаров
    const imagesResult = await pool.query(
      'SELECT image_url FROM products WHERE id = ANY($1)',
      [ids]
    );
    
    // Удаляем записи из БД
    await pool.query('DELETE FROM products WHERE id = ANY($1)', [ids]);
    
    // Удаляем файлы изображений
    for (const row of imagesResult.rows) {
      if (row.image_url) {
        try {
          const imagePath = path.join(imagesDir, row.image_url);
          await fsp.unlink(imagePath);
          console.log(`🗑️  Изображение удалено: ${row.image_url}`);
        } catch (fileError) {
          if (fileError.code !== 'ENOENT') {
            console.error(`⚠️ Ошибка удаления файла ${row.image_url}:`, fileError);
          }
        }
      }
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('❌ API: Error bulk deleting products:', error);
    res.status(500).json({ error: 'Ошибка при массовом удалении товаров' });
  }
});


// Архивировать/восстановить товар
app.patch('/api/products/:id/archive', async (req, res) => {
  try {
    const { id } = req.params;
    const { archived } = req.body;
    const result = await pool.query('UPDATE products SET archived = $1 WHERE id = $2 RETURNING *', [archived, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(parseProductRow(result.rows[0]));
  } catch (error) {
    console.error('❌ API: Error archiving/restoring product:', error);
    res.status(500).json({ error: 'Ошибка при архивировании/восстановлении товара' });
  }
});

 

// Массовая архивация/восстановление товаров
app.post('/api/products/bulk-archive', async (req, res) => {
  try {
    const { ids, archive } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'ids required' });
    await pool.query('UPDATE products SET archived = $1 WHERE id = ANY($2)', [archive, ids]);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ API: Error bulk archiving/restoring products:', error);
    res.status(500).json({ error: 'Ошибка при массовой архивации/восстановлении товаров' });
  }
});

// Массовое объединение товаров по modelName
app.post('/api/products/bulk-merge', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length < 2) return res.status(400).json({ error: 'Минимум два товара для объединения' });
    const { v4: uuidv4 } = require('uuid');
    const modelName = `model_${uuidv4()}`;
    await pool.query('UPDATE products SET model_name = $1 WHERE id = ANY($2)', [modelName, ids]);
    // Архивируем все кроме первого
    const mainId = ids[0];
    const archiveIds = ids.slice(1);
    if (archiveIds.length > 0) {
      await pool.query('UPDATE products SET archived = true WHERE id = ANY($1)', [archiveIds]);
    }
    res.json({ success: true, modelName });
  } catch (error) {
    console.error('❌ API: Error merging products:', error);
    res.status(500).json({ error: 'Ошибка при объединении товаров' });
  }
});

// Создать категорию
app.post('/api/categories', async (req, res) => {
  try {
    const { name, imageUrl } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    const { v4: uuidv4 } = require('uuid');
    const id = uuidv4();
    const result = await pool.query('INSERT INTO categories (id, name, image_url) VALUES ($1, $2, $3) RETURNING *', [id, name, imageUrl || '/placeholder.svg']);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ API: Error creating category:', error);
    res.status(500).json({ error: 'Ошибка при создании категории' });
  }
});

// Обновить изображение категории
app.patch('/api/categories/:id/image', async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;
    if (!imageUrl) return res.status(400).json({ error: 'imageUrl required' });
    const result = await pool.query('UPDATE categories SET image_url = $1 WHERE id = $2 RETURNING *', [imageUrl, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Category not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ API: Error updating category image:', error);
    res.status(500).json({ error: 'Ошибка при обновлении изображения категории' });
  }
});

// Удалить категорию
app.delete('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Category not found' });
    res.json({ success: true });
  } catch (error) {
    console.error('❌ API: Error deleting category:', error);
    res.status(500).json({ error: 'Ошибка при удалении категории' });
  }
});
 



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesDir); // Сохраняем прямо в images
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    
    // 3. Генерация имени файла (уже хорошая реализация)
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, fileName);
  }
});

// Фильтр для изображений (оставляем как есть)
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp',
    'image/svg+xml'
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Недопустимый формат файла. Разрешены только изображения.'));
  }
};

const upload = multer({ 
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // 20 МБ
});

// Endpoint для загрузки изображений
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Файл не загружен' });
  }
  
  // 4. Получаем ТОЛЬКО имя файла (без пути)
  const fileName = req.file.filename; // например: "1623456789123-123456789.jpg"
  
  // 5. Здесь сохраняем fileName в БД
  // Пример: await ImageModel.create({ filename: fileName });
  
  // 6. Возвращаем только имя файла (или относительный путь)
  res.json({ url: `${fileName}` }); // или просто fileName, если путь известен на клиенте
});

app.get('/api/chat/:userId/history', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `SELECT id, sender_id AS "senderId", text, created_at AS "createdAt", 
       (sender_id = 'admin') AS "isAdmin"
       FROM messages 
       WHERE user_id = $1 
       ORDER BY created_at ASC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Отправка сообщения
app.post('/api/chat/:userId/send', async (req, res) => {
  try {
    const { userId } = req.params;
    const { text, senderId } = req.body;

    // Если senderId не передан — значит это пользователь, иначе админ
    const actualSenderId = senderId || userId;

    const result = await pool.query(
      `INSERT INTO messages (user_id, sender_id, text) 
       VALUES ($1, $2, $3) 
       RETURNING id, sender_id AS "senderId", text, created_at AS "createdAt"`,
      [userId, actualSenderId, text]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.post('/api/chat/mark-read/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    await pool.query(
      `UPDATE messages SET is_read = true WHERE id = $1`,
      [messageId]
    );
    res.sendStatus(200);
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Пометить все сообщения пользователя как прочитанные
app.post('/api/chat/:userId/mark-all-read', async (req, res) => {
  try {
    const { userId } = req.params;
    await pool.query(
      `UPDATE messages SET is_read = true 
       WHERE user_id = $1 AND is_read = false`,
      [userId]
    );
    res.sendStatus(200);
  } catch (error) {
    console.error('Error marking all messages as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Получение количества непрочитанных сообщений для пользователя
app.get('/api/chat/:userId/unread-count', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `SELECT COUNT(*) FROM messages 
       WHERE user_id = $1 AND is_read = false AND sender_id = 'admin'`,
      [userId]
    );
    res.json({ unreadCount: parseInt(result.rows[0].count, 10) });
  } catch (error) {
    console.error('Error fetching unread message count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

 


// Настройка WebSocket сервера
const wss = new WebSocket.Server({ server });
const connections = new Map();

wss.on('connection', (ws, req) => {
  // Парсим URL для получения типа соединения (user/admin) и userId
  const urlParts = req.url?.split('/').filter(Boolean) || [];
  if (urlParts.length < 3 || urlParts[0] !== 'chat' || !['user', 'admin'].includes(urlParts[1])) {
    ws.close();
    return;
  }

  const connType = urlParts[1]; // 'user' или 'admin'
  const userId = urlParts[2];
  const connKey = `${connType}-${userId}`;

  // Сохраняем соединение
  connections.set(connKey, ws);
  console.log(`✅ WebSocket: Соединение установлено для ${connKey}`);

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'message') {
        const senderId = data.senderId || (connType === 'admin' ? 'admin' : userId);
        const isAdminMessage = senderId === 'admin';

        // Определяем получателя
        const recipientConnKey = isAdminMessage 
          ? `user-${data.userId}` 
          : `admin-${data.userId}`;

        // Проверяем онлайн-статус получателя
        const recipientWs = connections.get(recipientConnKey);
        const isRead = !!recipientWs && recipientWs.readyState === WebSocket.OPEN;

        // Сохраняем сообщение в БД
        const result = await pool.query(
          `INSERT INTO messages (user_id, sender_id, text, is_read) 
           VALUES ($1, $2, $3, $4) 
           RETURNING id, user_id, sender_id, text, created_at, is_read`,
          [data.userId, senderId, data.text, isRead]
        );

        const messageData = {
          id: result.rows[0].id,
          user_id: data.userId,
          sender_id: senderId,
          text: data.text,
          created_at: result.rows[0].created_at,
          is_read: result.rows[0].is_read
        };

        // Отправляем сообщение получателю (если онлайн)
        if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
          recipientWs.send(JSON.stringify(messageData));
        }

        // Для двустороннего чата - отправляем копию отправителю
        if (isAdminMessage) {
          const senderWs = connections.get(`user-${data.userId}`);
          if (senderWs && senderWs.readyState === WebSocket.OPEN) {
            senderWs.send(JSON.stringify(messageData));
          }
        } else {
          const adminWs = connections.get(`admin-${data.userId}`);
          if (adminWs && adminWs.readyState === WebSocket.OPEN) {
            adminWs.send(JSON.stringify(messageData));
          }
        }
      }
    } catch (error) {
      console.error('❌ WebSocket: Ошибка обработки сообщения:', error);
    }
  });

  ws.on('close', () => {
    connections.delete(connKey);
    console.log(`❌ WebSocket: Соединение закрыто для ${connKey}`);
  });

  ws.on('error', (error) => {
    console.error(`❌ WebSocket: Ошибка соединения для ${connKey}:`, error);
  });
});


server.listen(port, () => {
  console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
  console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET);
  console.log(`🚀 HTTP сервер работает на http://localhost:${port}`);
  console.log(`🚀 WebSocket сервер работает на ws://localhost:${port}`);
});