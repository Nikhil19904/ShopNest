const express = require('express');
const { addRating, getProductRatings, getUserRating, deleteRating } = require('../controllers/ratingController');
const verifyToken = require('../middlewares/verifyToken');

const ratingRouter = express.Router();

// Protected routes (require authentication)
ratingRouter.post('/add', verifyToken, addRating);
ratingRouter.get('/user/:productId', verifyToken, getUserRating);
ratingRouter.delete('/:productId', verifyToken, deleteRating);

// Public routes
ratingRouter.get('/product/:productId', getProductRatings);

module.exports = ratingRouter; 