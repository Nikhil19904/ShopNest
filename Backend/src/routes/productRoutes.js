const express = require('express');
const { getAllProducts, getProduct } = require('../controllers/productController');
const productRouter = express.Router();

// Get all products
productRouter.get('/', getAllProducts);

// Get single product
productRouter.get('/:id', getProduct);

module.exports = productRouter; 