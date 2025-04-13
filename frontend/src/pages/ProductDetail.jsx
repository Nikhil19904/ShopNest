import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaSpinner, FaHeart, FaShoppingCart, FaShare, FaTruck, FaUndo, FaShieldAlt } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { request } from '../utils/request';
import { toast } from 'react-toastify';
import ProductGallery from '../components/ProductGallery';
import { getUser as getUserAction } from '../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';

// USD to INR conversion rate
const USD_TO_INR_RATE = 83.16; // As of current rate, update as needed

// Convert USD to INR
const convertToINR = (usdPrice) => {
  if (!usdPrice) return "0.00";
  const inrPrice = usdPrice * USD_TO_INR_RATE;
  return inrPrice.toFixed(2);
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [rating, setRating] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const dispatch = useDispatch();

  const fetchProduct = useCallback(async () => {
    // Check if ID is undefined or invalid
    if (!id || id === 'undefined') {
      console.error('Invalid product ID:', id);
      toast.error('Product not found');
      navigate('/products');
      return;
    }
    
    try {
      setLoading(true);
      const response = await request(`/api/products/${id}`);
      if (response.success) {
        setProduct(response.data);
        // Set default color and size if available
        if (response.data.colors?.length > 0) {
          setSelectedColor(response.data.colors[0]);
        }
        if (response.data.sizes?.length > 0) {
          setSelectedSize(response.data.sizes[0]);
        }
      } else {
        toast.error('Product not found');
        navigate('/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const fetchProductRating = useCallback(async () => {
    try {
      const response = await request(`/api/ratings/product/${id}/average`);
      if (response.success) {
        setRating(response.data.averageRating);
      }
    } catch (error) {
      console.error('Error fetching product rating:', error);
    }
  }, [id]);

  const checkWishlistStatus = useCallback(async () => {
    try {
      setIsWishlistLoading(true);
      const response = await request(`/api/wishlist/check/${id}`);
      if (response.success) {
        setIsInWishlist(response.data.isInWishlist);
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    } finally {
      setIsWishlistLoading(false);
    }
  }, [id]);

  const getUser = useCallback(async () => {
    try {
      dispatch(getUserAction());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    if (user && product) {
      checkWishlistStatus();
      fetchProductRating();
    }
  }, [user, product, checkWishlistStatus, fetchProductRating]);

  const toggleWishlist = async () => {
    if (!user) {
      toast.info('Please login to add items to your wishlist');
      return;
    }

    try {
      setIsWishlistLoading(true);
      const endpoint = isInWishlist ? `/api/wishlist/remove/${id}` : '/api/wishlist/add';
      const method = isInWishlist ? 'DELETE' : 'POST';
      const body = isInWishlist ? null : { productId: id };

      const response = await request(endpoint, {
        method,
        body: body ? JSON.stringify(body) : null,
      });

      if (response.success) {
        setIsInWishlist(!isInWishlist);
        toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Failed to update wishlist');
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.info('Please login to add items to your cart');
      return;
    }

    // Check if color and size are selected when required
    if (product.colors?.length > 0 && !selectedColor) {
      toast.info('Please select a color');
      return;
    }
    
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.info('Please select a size');
      return;
    }

    try {
      setIsAddingToCart(true);
      await addToCart(id, quantity, selectedColor, selectedSize);
      toast.success('Added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 10) {
      setQuantity(value);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success('Link copied to clipboard'))
        .catch(() => toast.error('Failed to copy link'));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-[var(--primary)]" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Gallery */}
        <div className="product-gallery-container">
          <ProductGallery product={product} />
        </div>

        {/* Product Info */}
        <div className="product-info">
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          
          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={star <= (rating || 0) ? 'text-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              {rating ? rating.toFixed(1) : 'No ratings'}
            </span>
          </div>
          
          {/* Price */}
          <div className="text-3xl font-bold text-[var(--primary)] mb-6">
            ₹{convertToINR(product.price)}
          </div>
          
          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
          </div>
          
          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Color</h2>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color
                        ? 'border-[var(--primary)]'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Size</h2>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md ${
                      selectedSize === size
                        ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                        : 'border-gray-300 dark:border-gray-600 hover:border-[var(--primary)]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max="10"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 text-center py-2 focus:outline-none bg-white dark:bg-gray-800"
              />
              <button 
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                +
              </button>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="flex-1 px-6 py-3 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--primary-dark)] disabled:opacity-50 flex items-center justify-center"
            >
              {isAddingToCart ? <FaSpinner className="animate-spin mr-2" /> : <FaShoppingCart className="mr-2" />}
              Add to Cart
            </button>
            
            <button
              onClick={toggleWishlist}
              disabled={isWishlistLoading}
              className={`p-3 rounded-md ${
                isInWishlist
                  ? 'bg-red-100 text-red-500 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
              }`}
            >
              {isWishlistLoading ? <FaSpinner className="animate-spin" /> : <FaHeart />}
            </button>
            
            <button
              onClick={handleShare}
              className="p-3 bg-gray-100 text-gray-500 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              <FaShare />
            </button>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              <FaTruck className="text-[var(--primary)] mr-2" />
              <span className="text-sm">Free Shipping</span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              <FaUndo className="text-[var(--primary)] mr-2" />
              <span className="text-sm">30-Day Returns</span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              <FaShieldAlt className="text-[var(--primary)] mr-2" />
              <span className="text-sm">Secure Payment</span>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="border-t dark:border-gray-700 pt-6">
            <h2 className="text-xl font-semibold mb-4">Product Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Category</span>
                <p className="font-medium">{product.category}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Brand</span>
                <p className="font-medium">{product.brand || 'Generic'}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">SKU</span>
                <p className="font-medium">{product._id}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Availability</span>
                <p className="font-medium text-green-500">In Stock</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 