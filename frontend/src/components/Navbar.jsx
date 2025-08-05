import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';
import { CiLight, CiDark, CiMenuBurger } from 'react-icons/ci';
import { FaSearch, FaChevronDown, FaChevronUp, FaUser, FaHome, FaBox, FaList } from 'react-icons/fa';
import { apiRequest } from '../utils/api';
import { ENDPOINTS } from '../config/api';
import CartIcon from './CartIcon';

const Navbar = ({ isDarkMode, setIsDarkMode }) => {
  const user = useSelector((state) => state.auth.user);
  const cart = useSelector((state) => state.cart.cart);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  // Removed unused showMiniCart state
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCategories, setShowCategories] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const miniCartRef = useRef(null);
  const categoryRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Categories for dropdown with icons
  const categories = [
    { 
      name: "All", 
      icon: <FaList />,
      image: null
    },
    { 
      name: "Electronics", 
      icon: <FaBox />,
      image: "/images/products/electronics/elec1.jpg"
    },
    { 
      name: "Clothing", 
      icon: <FaBox />,
      image: "/images/products/clothing/cloth1.jpg"
    },
    { 
      name: "Jewelry", 
      icon: <FaBox />,
      image: null
    },
    { 
      name: "Men's Clothing", 
      icon: <FaBox />,
      image: "/images/products/clothing/cloth2.jpg"
    },
    { 
      name: "Women's Clothing", 
      icon: <FaBox />,
      image: "/images/products/clothing/cloth1.jpg"
    },
    { 
      name: "Stationery", 
      icon: <FaBox />,
      image: null
    },
    { 
      name: "Grocery", 
      icon: <FaBox />,
      image: null
    }
  ];

  // Handle outside click for mini cart
  useEffect(() => {
    function handleClickOutside(event) {
      // Removed unused showMiniCart logic
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setShowCategories(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [miniCartRef, categoryRef]);

  const handleLogout = async () => {
    try {
      const response = await apiRequest('GET', ENDPOINTS.AUTH.LOGOUT);
      
      if (response.success) {
        dispatch(logout());
        localStorage.removeItem('token');
        toast.success(response.message || 'Logged out successfully');
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout from frontend even if API call fails
      dispatch(logout());
      localStorage.removeItem('token');
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const query = `${searchQuery.trim()}${selectedCategory !== "All" ? `&category=${selectedCategory.toLowerCase()}` : ''}`;
      navigate(`/products?search=${encodeURIComponent(query)}`);
      setSearchQuery('');
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setShowCategories(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className={`fixed w-full z-50 top-0 transition-all duration-300 ${scrolled ? 'py-1 shadow-lg' : 'py-3 shadow-md'} ${isDarkMode ? 'bg-gradient-to-r from-purple-900 to-indigo-900' : 'bg-gradient-to-r from-blue-600 to-purple-600'}`}>
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className={`text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-purple-700 transition-all duration-500 transform hover:scale-105 ${scrolled ? 'text-xl' : 'text-2xl'}`}
          >
            ShopNest
          </Link>

          {/* Modern Search Bar - Desktop */}
          <div className={`hidden md:flex items-center relative max-w-lg w-full mx-4 transition-all duration-300 ${scrolled ? 'scale-95' : 'scale-100'}`}>
            <form onSubmit={handleSearch} className="w-full">
              <div className={`flex items-center rounded-lg overflow-hidden transition-all duration-300 ${
                isSearchFocused 
                  ? 'ring-2 ring-indigo-500 shadow-lg transform scale-102' 
                  : 'shadow-md'
              }`}>
                {/* Category Dropdown */}
                <div className="relative" ref={categoryRef}>
                  <button
                    type="button"
                    onClick={() => setShowCategories(!showCategories)}
                    className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium transition-colors border-r ${
                      isDarkMode 
                        ? 'bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700' 
                        : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {selectedCategory}
                    {showCategories ? (
                      <FaChevronUp className="ml-2 w-3 h-3 animate-bounce" />
                    ) : (
                      <FaChevronDown className="ml-2 w-3 h-3" />
                    )}
                  </button>
                  
                  {/* Categories Dropdown */}
                  {showCategories && (
                    <div className={`absolute top-full left-0 mt-1 w-64 z-50 rounded-md shadow-lg overflow-hidden animate-fadeIn ${
                      isDarkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                      <ul className="animate-slideDown">
                        {categories.map((category) => (
                          <li key={category.name}>
                            <button
                              type="button"
                              onClick={() => handleCategoryChange(category.name)}
                              className={`flex items-center w-full text-left px-4 py-3 text-sm transition-all duration-200 ${
                                isDarkMode 
                                  ? 'text-gray-200 hover:bg-gray-700' 
                                  : 'text-gray-700 hover:bg-gray-100'
                              } ${selectedCategory === category.name ? 'font-medium bg-opacity-10 bg-indigo-500' : ''} hover:translate-x-1`}
                            >
                              {category.image ? (
                                <div className="w-10 h-10 rounded-md overflow-hidden mr-3 flex-shrink-0">
                                  <img 
                                    src={category.image} 
                                    alt={category.name} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <span className="mr-3 transition-transform duration-200 group-hover:rotate-12">{category.icon}</span>
                              )}
                              <div className="flex flex-col">
                                <span className="font-medium">{category.name}</span>
                                {category.name === "Electronics" && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400">Latest gadgets and devices</span>
                                )}
                                {category.name === "Clothing" && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400">Fashion for everyone</span>
                                )}
                                {category.name === "Men's Clothing" && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400">Stylish men's fashion</span>
                                )}
                                {category.name === "Women's Clothing" && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400">Trendy women's fashion</span>
                                )}
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className={`w-full py-2.5 px-4 text-base focus:outline-none transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-800 text-white placeholder-gray-400' 
                      : 'bg-white text-gray-800 placeholder-gray-500'
                  }`}
                />
                
                {/* Search Button */}
                <button 
                  type="submit"
                  className={`px-4 py-2.5 flex items-center justify-center transition-all duration-300 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  <FaSearch className="mr-1 animate-pulse" />
                  <span className="text-sm font-medium">Search</span>
                </button>
              </div>
            </form>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden visible p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors duration-200 hover:rotate-12 transform"
            onClick={() => setIsOpen(!isOpen)}
          >
            <CiMenuBurger size={25} className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'} text-white`} />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Home Link */}
            <Link 
              to="/" 
              className={`flex flex-col items-center group relative py-2 transition-all duration-300 hover:-translate-y-1 ${
                isActive('/') ? 'text-yellow-300' : 'text-white hover:text-yellow-200'
              }`}
            >
              <FaHome className={`text-xl mb-1 transition-transform duration-300 group-hover:scale-110 ${isActive('/') ? 'animate-pulse text-indigo-600' : ''}`} />
              <span className="text-xs relative">
              Home
                {isActive('/') && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-600 animate-expandWidth"></span>
                )}
              </span>
            </Link>

            {/* Products Link */}
            <Link 
              to="/products" 
              className={`flex flex-col items-center group relative py-2 transition-all duration-300 hover:-translate-y-1 ${
                isActive('/products') ? 'text-yellow-300' : 'text-white hover:text-yellow-200'
              }`}
            >
              <FaBox className={`text-xl mb-1 transition-transform duration-300 group-hover:scale-110 ${isActive('/products') ? 'animate-pulse text-indigo-600' : ''}`} />
              <span className="text-xs relative">
              Products
                {isActive('/products') && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-600 animate-expandWidth"></span>
                )}
              </span>
            </Link>
            
            {/* Cart Link */}
            <Link
              to="/cart"
              className={`flex flex-col items-center group relative py-2 transition-all duration-300 hover:-translate-y-1 ${
                isActive('/cart') ? 'text-yellow-300' : 'text-white hover:text-yellow-200'
              }`}
            >
              <div className="relative">
                <CartIcon cart={cart} isDarkMode={isDarkMode} />
                {cart && cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-heartbeat">
                    {cart.length}
                  </span>
                )}
              </div>
              <span className="text-xs relative">
                Cart
                {isActive('/cart') && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-600 animate-expandWidth"></span>
                )}
              </span>
            </Link>
            
            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button
                  className={`flex flex-col items-center py-2 transition-all duration-300 hover:-translate-y-1 ${
                    isActive('/profile') ? 'text-yellow-300' : 'text-white hover:text-yellow-200'
                  }`}
                >
                  <FaUser className={`text-xl mb-1 transition-transform duration-300 group-hover:scale-110 ${isActive('/profile') ? 'animate-pulse text-indigo-600' : ''}`} />
                  <span className="text-xs relative">
                    Account
                    {isActive('/profile') && (
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-600 animate-expandWidth"></span>
                    )}
                  </span>
                </button>
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-1">
                  <div className="py-1 animate-fadeIn">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:pl-6"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:pl-6"
                    >
                      Orders
                </Link>
                <button 
                  onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:pl-6"
                >
                  Logout
                </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className={`flex flex-col items-center py-2 transition-all duration-300 hover:-translate-y-1 ${
                    isActive('/login') ? 'text-yellow-300' : 'text-white hover:text-yellow-200'
                  }`}
                >
                  <FaUser className={`text-xl mb-1 transition-transform duration-300 hover:scale-110 ${isActive('/login') ? 'animate-pulse text-indigo-600' : ''}`} />
                  <span className="text-xs relative">
                  Login
                    {isActive('/login') && (
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-600 animate-expandWidth"></span>
                    )}
                  </span>
                </Link>
                <Link 
                  to="/register" 
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                    isDarkMode 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow hover:shadow-indigo-200'
                  }`}
                >
                  Register
                </Link>
              </div>
            )}
            
            {/* Dark Mode Toggle */}
              <button 
              onClick={() => {
                if (typeof setIsDarkMode === 'function') {
                  setIsDarkMode(prevMode => !prevMode);
                }
              }}
              className="flex flex-col items-center group relative py-2 transition-all duration-300 hover:-translate-y-1 text-white hover:text-yellow-200"
            >
              {isDarkMode ? (
                <CiLight className="text-xl mb-1 transition-transform duration-300 group-hover:scale-110 animate-spin-slow" />
              ) : (
                <CiDark className="text-xl mb-1 transition-transform duration-300 group-hover:scale-110 animate-spin-slow" />
              )}
              <span className="text-xs">{isDarkMode ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden transition-all duration-500 ease-in-out ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          {/* Mobile navigation content here */}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;