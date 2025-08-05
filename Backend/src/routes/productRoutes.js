const express = require('express');
const { getAllProducts, getProduct, getProductByBarcode } = require('../controllers/productController');
const productRouter = express.Router();

// Get all products
productRouter.get('/', getAllProducts);

// Search product by barcode
productRouter.get('/search/barcode/:barcode', getProductByBarcode);

// Get single product (keep this after barcode route to avoid conflicts)
productRouter.get('/:id', getProduct);

module.exports = productRouter; 