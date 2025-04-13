import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';

const CartIcon = ({ cart, isDarkMode }) => {
  return (
    <div className="relative">
      <FaShoppingCart className="text-xl mb-1 text-blue-600 drop-shadow-[0_0_2px_rgba(37,99,235,0.5)]" />
      {cart && cart.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {cart.length}
        </span>
      )}
    </div>
  );
};

export default CartIcon; 