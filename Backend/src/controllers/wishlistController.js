const Wishlist = require('../models/wishlist');
const Product = require('../models/product');

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.id;
    
    let wishlist = await Wishlist.findOne({ userId })
      .populate({
        path: 'products',
        select: 'title price image description category rating'
      });
    
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId, products: [] });
    }
    
    res.status(200).json({
      success: true,
      wishlist
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching wishlist',
      error: error.message
    });
  }
};

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId, products: [] });
    }
    
    // Check if product already in wishlist
    if (wishlist.products.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }
    
    // Add product to wishlist
    wishlist.products.push(productId);
    await wishlist.save();
    
    res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      wishlist
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to wishlist',
      error: error.message
    });
  }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.params;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }
    
    // Find wishlist
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }
    
    // Check if product in wishlist
    if (!wishlist.products.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product not in wishlist'
      });
    }
    
    // Remove product from wishlist
    wishlist.products = wishlist.products.filter(
      id => id.toString() !== productId
    );
    await wishlist.save();
    
    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      wishlist
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing from wishlist',
      error: error.message
    });
  }
};

// Check if product is in wishlist
exports.checkWishlistStatus = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.params;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }
    
    // Find wishlist
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(200).json({
        success: true,
        isInWishlist: false
      });
    }
    
    // Check if product in wishlist
    const isInWishlist = wishlist.products.includes(productId);
    
    res.status(200).json({
      success: true,
      isInWishlist
    });
  } catch (error) {
    console.error('Error checking wishlist status:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking wishlist status',
      error: error.message
    });
  }
}; 