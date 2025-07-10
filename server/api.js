
"use strict";

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3001;
const fs = require('fs'); 
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
    console.log('✅ PostgreSQL connected successfully');
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

app.listen(port, () => {
  console.log(`🚀 API server running on http://localhost:${port}`);
}); 