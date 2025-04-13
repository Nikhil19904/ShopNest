import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaStar, FaRegHeart, FaEye, FaTag } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../app/slices/cartSlice';
import toast from 'react-hot-toast';
import { apiRequest } from '../utils/api';
import { ENDPOINTS } from '../config/api';

// USD to INR conversion rate
const USD_TO_INR_RATE = 83.16; // As of current rate, update as needed

// Convert USD to INR
const convertToINR = (usdPrice) => {
  if (!usdPrice) return "0.00";
  const inrPrice = usdPrice * USD_TO_INR_RATE;
  return inrPrice.toFixed(2);
};

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlistHovered, setIsWishlistHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // Ensure we have a valid product with an ID
  if (!product || !product.id) {
    console.error('Invalid product data:', product);
    return null; // Don't render anything if product is invalid
  }

  // Handle multiple product images
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : product.image 
      ? [product.image] 
      : ['https://via.placeholder.com/300'];

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      setIsAddingToCart(true);
      const response = await apiRequest('POST', ENDPOINTS.CART.ADD, { 
        productId: product.id,
        quantity: 1
      });
      
      if (response.success) {
        dispatch(addToCart({ ...product, quantity: 1 }));
        toast.success(response.message || "Added to cart successfully");
      } else {
        toast.error(response.message || "Failed to add to cart");
      }
    } catch (error) {
      toast.error("Something went wrong adding to cart");
      console.error(error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error("Please login to manage wishlist");
      return;
    }

    try {
      setIsWishlisted(!isWishlisted);
      toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
    } catch (error) {
      toast.error("Something went wrong with wishlist");
      console.error(error);
    }
  };

  // Change image on hover for grid view
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (productImages.length > 1) {
      setCurrentImageIndex(1);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentImageIndex(0);
  };

  // Calculate discount price
  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount 
    ? product.price - (product.price * (product.discount / 100)) 
    : product.price;

  // Grid view rendering
  if (viewMode === 'grid') {
    return (
      <div 
        className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Discount badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {product.discount}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 ${
            isWishlistHovered || isWishlisted
              ? 'bg-red-500 text-white scale-110' 
              : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300'
          }`}
          onMouseEnter={() => setIsWishlistHovered(true)}
          onMouseLeave={() => setIsWishlistHovered(false)}
        >
          {isWishlisted ? <FaHeart className="w-5 h-5" /> : <FaRegHeart className="w-5 h-5" />}
        </button>

        {/* Quick view button - appears on hover */}
        <div className={`absolute bottom-24 left-0 right-0 flex justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <Link 
            to={`/product/${product.id}`}
            className="bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white px-4 py-2 rounded-full flex items-center space-x-2 transform transition-transform hover:scale-105 shadow-md"
          >
            <FaEye />
            <span>Quick View</span>
          </Link>
        </div>

        {/* Product Image */}
        <Link to={`/product/${product.id}`} className="block relative overflow-hidden">
          <div className="aspect-w-1 aspect-h-1 w-full">
            <img
              src={productImages[currentImageIndex]}
              alt={product.title}
              className={`w-full h-64 object-contain object-center transition-transform duration-500 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
            />
            {/* Overlay gradient */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-4">
          {product.brand && (
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              {product.brand}
            </div>
          )}
          
          <Link to={`/product/${product.id}`}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
              {product.title}
            </h3>
          </Link>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              {hasDiscount && (
                <span className="text-sm line-through text-gray-500 dark:text-gray-400">
                  ₹{convertToINR(product.price)}
                </span>
              )}
              <span className="text-xl font-bold text-[var(--primary)] dark:text-[var(--primary-light)]">
                ₹{convertToINR(discountedPrice)}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={`w-4 h-4 ${
                    index < Math.floor(product.rating?.rate || 0)
                      ? 'text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
              <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">
                ({product.rating?.count || 0})
              </span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || !product.inStock}
            className={`w-full py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 ${
              product.inStock 
                ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white hover:shadow-lg transform hover:-translate-y-0.5'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed'
            } disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group`}
          >
            <span className="relative z-10 flex items-center space-x-2">
              {isAddingToCart ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FaShoppingCart className="w-4 h-4" />
              )}
              <span>{!product.inStock ? 'Out of Stock' : isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
            </span>
            {product.inStock && (
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-dark)] to-[var(--accent-dark)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
          </button>
        </div>
      </div>
    );
  }

  // List view rendering
  return (
    <div 
      className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col md:flex-row"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Discount badge */}
      {hasDiscount && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          {product.discount}% OFF
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 ${
          isWishlistHovered || isWishlisted
            ? 'bg-red-500 text-white scale-110' 
            : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300'
        }`}
        onMouseEnter={() => setIsWishlistHovered(true)}
        onMouseLeave={() => setIsWishlistHovered(false)}
      >
        {isWishlisted ? <FaHeart className="w-5 h-5" /> : <FaRegHeart className="w-5 h-5" />}
      </button>

      {/* Product Image */}
      <div className="md:w-1/4">
        <Link to={`/product/${product.id}`} className="block relative overflow-hidden">
        <div className="aspect-w-1 aspect-h-1 w-full">
          <img
              src={productImages[currentImageIndex]}
            alt={product.title}
              className="w-full h-48 md:h-64 object-contain object-center transition-transform duration-500"
          />
            {/* Overlay gradient */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
        </div>
      </Link>
      </div>

      {/* Product Info */}
      <div className="p-4 md:p-6 md:w-3/4 flex flex-col justify-between">
        <div>
          {product.brand && (
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              {product.brand}
            </div>
          )}
          
          <Link to={`/product/${product.id}`}>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-[var(--primary)] transition-colors">
            {product.title}
          </h3>
        </Link>
        
          <div className="flex items-center mb-3">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className={`w-4 h-4 ${
                  index < Math.floor(product.rating?.rate || 0)
                    ? 'text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
            <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">
              ({product.rating?.count || 0})
            </span>
        </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {product.description}
        </p>

          {/* Features / Tags */}
          {product.category && (
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                <FaTag className="mr-1" />
                {product.category}
              </span>
              
              {product.inStock ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
                  Out of Stock
                </span>
              )}
              
              {product.colors && product.colors.length > 0 && (
                <div className="flex items-center gap-1">
                  {product.colors.map((color, index) => (
                    <div 
                      key={index}
                      className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600"
                      style={{ 
                        backgroundColor: 
                          color.toLowerCase() === 'red' ? '#FF0000' :
                          color.toLowerCase() === 'blue' ? '#0000FF' :
                          color.toLowerCase() === 'green' ? '#00FF00' :
                          color.toLowerCase() === 'black' ? '#000000' :
                          color.toLowerCase() === 'white' ? '#FFFFFF' :
                          color.toLowerCase() === 'yellow' ? '#FFFF00' :
                          color.toLowerCase() === 'purple' ? '#800080' :
                          color.toLowerCase() === 'pink' ? '#FFC0CB' :
                          color.toLowerCase() === 'orange' ? '#FFA500' :
                          color.toLowerCase() === 'gray' ? '#808080' : '#CCCCCC'
                      }}
                      title={color}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            {hasDiscount && (
              <span className="text-sm line-through text-gray-500 dark:text-gray-400">
                ₹{convertToINR(product.price)}
              </span>
            )}
            <span className="text-2xl font-bold text-[var(--primary)] dark:text-[var(--primary-light)]">
              ₹{convertToINR(discountedPrice)}
            </span>
            {hasDiscount && (
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                Save {product.discount}%
              </span>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Link 
              to={`/product/${product.id}`}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaEye className="w-5 h-5" />
            </Link>
            
        <button
          onClick={handleAddToCart}
              disabled={isAddingToCart || !product.inStock}
              className={`px-6 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 ${
                product.inStock 
                  ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white hover:shadow-lg'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isAddingToCart ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FaShoppingCart className="w-4 h-4 mr-2" />
              )}
              <span>{!product.inStock ? 'Out of Stock' : isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
        </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 