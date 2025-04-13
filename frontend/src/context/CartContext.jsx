import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { apiRequest } from '../utils/api';
import { ENDPOINTS } from '../config/api';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useSelector(state => state.auth);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const updateCartStats = (cartData) => {
    if (!cartData || !cartData.items || cartData.items.length === 0) {
      setItemCount(0);
      setTotalPrice(0);
      return;
    }

    const count = cartData.items.reduce((total, item) => total + item.quantity, 0);
    const price = cartData.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    setItemCount(count);
    setTotalPrice(price);
  };

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart(null);
      setItemCount(0);
      setTotalPrice(0);
      return;
    }
    
    try {
      setLoading(true);
      const response = await apiRequest('GET', ENDPOINTS.CART.GET);
      if (response.success) {
        const cartData = response.data || { items: [] };
        setCart(cartData);
        updateCartStats(cartData);
      } else if (response.statusCode === 404) {
        const emptyCart = { items: [] };
        setCart(emptyCart);
        updateCartStats(emptyCart);
      } else {
        console.error('Error fetching cart:', response.message);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return false;
    }
    
    if (!productId || productId === 'undefined') {
      console.error('Invalid product ID:', productId);
      toast.error('Invalid product selected');
      return false;
    }
    
    try {
      setLoading(true);
      const response = await apiRequest('POST', ENDPOINTS.CART.ADD, { productId, quantity });
      if (response.success) {
        setCart(response.data);
        updateCartStats(response.data);
        toast.success('Item added to cart');
        return true;
      } else {
        toast.error(response.message || 'Failed to add item');
        return false;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.message || 'Failed to add item');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (productId, quantity) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await apiRequest('PUT', ENDPOINTS.CART.UPDATE, { productId, quantity });
      if (response.success) {
        setCart(response.data);
        updateCartStats(response.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error(error.message || 'Failed to update cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await apiRequest('DELETE', ENDPOINTS.CART.CLEAR);
      if (response.success) {
        setCart(null);
        setItemCount(0);
        setTotalPrice(0);
        toast.success('Cart cleared');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error(error.message || 'Failed to clear cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        itemCount,
        totalPrice,
        addToCart,
        updateCartItem,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext); 