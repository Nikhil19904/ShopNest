import React, { useState} from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaUser } from 'react-icons/fa';
import { CiLight, CiDark, CiMenuBurger } from 'react-icons/ci';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';
import CartIcon from './CartIcon';
import { apiRequest } from '../utils/api';
import { ENDPOINTS } from '../config/api';

const Navbar = ({ isDarkMode, setIsDarkMode }) => {
  const user = useSelector((state) => state.auth.user);
  const cart = useSelector((state) => state.cart.cart);
  const [isOpen, setIsOpen] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const categories = [
    { name: "Electronics", image: "/images/products/electronics/elec1.jpg" },
    { name: "Clothing", image: "/images/products/clothing/cloth1.jpg" },
    { name: "Jewelry", image: "/images/products/jewelry/jewel1.jpg" },
    { name: "Stationery", image: "/images/products/stationery/st1.jpg" },
    { name: "Grocery", image: "/images/products/grocery/groc1.jpg" },
  ];

  const handleLogout = async () => {
    try {
      const response = await apiRequest('GET', ENDPOINTS.AUTH.LOGOUT);
      if (response.success) {
        dispatch(logout());
        localStorage.removeItem('token');
        toast.success(response.message || 'Logged out successfully');
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
      dispatch(logout());
      localStorage.removeItem('token');
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`fixed top-0 w-full z-50 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-md`}>
      <nav className="container mx-auto px-4 flex items-center justify-between h-16 relative">
        {/* Logo */}
        <Link to="/" className="font-bold text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform">
          ShopNest
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex flex-1 mx-4 max-w-xl">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`flex-1 px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900'}`}
          />
          <button type="submit" className="px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-md transition-all">
            <FaSearch />
          </button>
        </form>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="relative">
            <button
              onMouseEnter={() => setShowProducts(true)}
              onMouseLeave={() => setShowProducts(false)}
              className={`px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-all`}
            >
              Products
            </button>
            {showProducts && (
              <div
                onMouseEnter={() => setShowProducts(true)}
                onMouseLeave={() => setShowProducts(false)}
                className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-gray-800 shadow-lg rounded-md p-4 grid grid-cols-2 gap-3"
              >
                {categories.map((cat) => (
                  <Link key={cat.name} to={`/products?category=${cat.name.toLowerCase()}`} className="flex flex-col items-center hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition-all">
                    <img src={cat.image} alt={cat.name} className="w-16 h-16 object-cover rounded-md mb-1" />
                    <span className="text-sm font-medium">{cat.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/" className={`${isActive('/') ? 'text-indigo-600' : ''} hover:text-indigo-500`}>Home</Link>
          <Link to="/cart" className="relative flex items-center">
            <CartIcon cart={cart} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{cart.length}</span>
            )}
          </Link>

          {/* User Menu */}
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-all">
                <FaUser /> {user.name}
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</Link>
                <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Orders</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800">Login</Link>
              <Link to="/register" className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all">Register</Link>
            </>
          )}

          {/* Dark Mode Toggle */}
          <button onClick={() => setIsDarkMode(prev => !prev)} className="px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-all">
            {isDarkMode ? <CiLight size={20} /> : <CiDark size={20} />}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          <CiMenuBurger size={25} />
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-md p-4 space-y-2">
          <Link to="/" className="block py-2">Home</Link>
          <button onClick={() => setShowProducts(!showProducts)} className="w-full text-left py-2">Products</button>
          {showProducts && (
            <div className="pl-4 space-y-1">
              {categories.map((cat) => (
                <Link key={cat.name} to={`/products?category=${cat.name.toLowerCase()}`} className="block py-1">{cat.name}</Link>
              ))}
            </div>
          )}
          {user ? (
            <>
              <Link to="/profile" className="block py-2">Profile</Link>
              <Link to="/orders" className="block py-2">Orders</Link>
              <button onClick={handleLogout} className="block py-2 w-full text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2">Login</Link>
              <Link to="/register" className="block py-2">Register</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
