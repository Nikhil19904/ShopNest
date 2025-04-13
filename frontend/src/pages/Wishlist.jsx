import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaHeart, FaTrash, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { apiRequest } from '../utils/api';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('GET', '/wishlist');
      
      if (data.success) {
        setWishlist(data.wishlist.products || []);
      }
    } catch (error) {
      toast.error('Failed to fetch wishlist');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const data = await apiRequest('DELETE', `/wishlist/remove/${productId}`);
      
      if (data.success) {
        toast.success('Product removed from wishlist');
        setWishlist(wishlist.filter(item => item._id !== productId));
      }
    } catch (error) {
      toast.error('Failed to remove from wishlist');
      console.error(error);
    }
  };

  const addToCart = async (product) => {
    try {
      const data = await apiRequest('POST', '/cart/add', {
        productId: product._id,
        quantity: 1
      });
      
      if (data.success) {
        toast.success('Product added to cart');
      }
    } catch (error) {
      toast.error('Failed to add to cart');
      console.error(error);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>
          <p className="mb-4">Please login to view your wishlist</p>
          <Link to="/login" className="btn-primary">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
        </div>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-12">
          <FaHeart className="mx-auto text-6xl text-gray-300 mb-4" />
          <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save items you love for later</p>
          <Link to="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <Link to={`/product/${product._id}`}>
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
              
              <div className="p-4">
                <Link to={`/product/${product._id}`}>
                  <h3 className="font-medium text-lg mb-2 text-gray-800 dark:text-white">
                    {product.title}
                  </h3>
                </Link>
                
                <div className="flex items-center mb-2">
                  <span className="text-[var(--primary)] font-bold text-xl">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex items-center justify-center px-3 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--primary-dark)] transition-colors"
                  >
                    <FaShoppingCart className="mr-2" />
                    Add to Cart
                  </button>
                  
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="flex items-center justify-center px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist; 