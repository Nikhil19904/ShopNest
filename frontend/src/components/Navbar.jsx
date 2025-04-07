import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setUser } from '../app/slices/authSlice';
import toast from 'react-hot-toast';
import { CiLight, CiDark, CiMenuBurger } from 'react-icons/ci';
import { FaShoppingCart } from 'react-icons/fa';

const Navbar = ({ isDarkMode, setIsDarkMode }) => {
  const user = useSelector((state) => state.auth.user);
  const cart = useSelector((state) => state.cart.cart);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/logout`, {
      credentials: 'include',
    });
    const data = await res.json();
    if (data.success) {
      dispatch(setUser(null));
      toast.success(data.message);
      navigate('/login');
    }
  };

  return (
    <header className={`fixed w-full z-50 top-0 transition-all duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <nav className="container mx-auto lg:p-5 px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
          >
            Shopping Cart
          </Link>

          {/* Mobile menu button */}
          <button 
            className="md:hidden visible p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            <CiMenuBurger size={25} className={isDarkMode ? 'text-white' : 'text-gray-800'} />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="nav-link"
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="nav-link"
            >
              Products
            </Link>
            {user ? (
              <>
                <Link 
                  to="/cart" 
                  className="relative nav-link"
                >
                  <FaShoppingCart className="text-xl" />
                  {cart && cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="nav-link"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Register
                </Link>
              </>
            )}
            <button 
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? <CiLight size={25} className="text-white" /> : <CiDark size={25} className="text-gray-800" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="flex flex-col space-y-4 py-4">
            <Link 
              to="/" 
              className="nav-link-mobile"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="nav-link-mobile"
              onClick={() => setIsOpen(false)}
            >
              Products
            </Link>
            {user ? (
              <>
                <Link 
                  to="/cart" 
                  className="nav-link-mobile flex items-center space-x-2 relative"
                  onClick={() => setIsOpen(false)}
                >
                  <FaShoppingCart />
                  <span>Cart</span>
                  {cart && cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="nav-link-mobile"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;