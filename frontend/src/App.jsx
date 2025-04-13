import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useDispatch } from 'react-redux'
import { getUser } from './redux/slices/authSlice'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { CartProvider } from './context/CartContext'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import LiveChatWidget from './components/LiveChatWidget'

// Pages
import Home from './pages/Home'
import ProductsPage from './pages/Products'
import ProductDetails from './pages/ProductDetail'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Orders from './pages/Orders'
import Success from './pages/Success'
import Cancel from './pages/Cancel'
import NotFound from './pages/NotFound'
import OrderTrackingPage from './pages/OrderTracking'

const App = () => {
  const dispatch = useDispatch()
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true' ? true : false;
  });

  useEffect(() => {
    // Apply dark mode class to html element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    // Try to get user data if token exists
    const token = localStorage.getItem('token')
    if (token) {
      dispatch(getUser())
    }
  }, [dispatch])

  return (
    <BrowserRouter>
      <CartProvider>
        <div className={`flex flex-col min-h-screen ${isDarkMode ? 'dark' : ''}`}>
          <ToastContainer position="top-right" />
          <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/track-order/:orderId" element={<OrderTrackingPage />} />
              <Route path="/track-order" element={<OrderTrackingPage />} />
              <Route path="/success" element={<Success />} />
              <Route path="/cancel" element={<Cancel />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <BackToTop />
          <LiveChatWidget />
          <ToastContainer position="bottom-right" />
        </div>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App