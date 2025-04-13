const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlistStatus
} = require('../controllers/wishlistController');

// Get user's wishlist
router.get('/', verifyToken, getWishlist);

// Add product to wishlist
router.post('/add', verifyToken, addToWishlist);

// Remove product from wishlist
router.delete('/remove/:productId', verifyToken, removeFromWishlist);

// Check if product is in wishlist
router.get('/check/:productId', verifyToken, checkWishlistStatus);

module.exports = router; 