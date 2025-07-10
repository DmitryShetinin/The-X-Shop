
"use strict";

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3001;
const fs = require('fs'); 
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

app.listen(port, () => {
     console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
     console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET);
   console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
    console.log('✅ PostgreSQL connected successfully');
  console.log(`🚀 API server running on http://localhost:${port}`);
}); 