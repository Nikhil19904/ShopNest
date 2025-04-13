import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-900/20 to-purple-900/20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDIuMjEgMS43OSA0IDQgNHM0LTEuNzkgNC00LTEuNzktNC00LTQtNCAxLjc5LTQgNHoiIGZpbGw9IiM0YzFkOTkiIG9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-10"></div>
      </div>

      <div className="relative container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Shopping Cart
            </h3>
            <p className="text-gray-400">
              Your one-stop destination for all your shopping needs. Quality products, great prices, and excellent service.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaFacebook />
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaTwitter />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaInstagram />
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="footer-link">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="footer-link">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/login" className="footer-link">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <FaMapMarkerAlt className="text-indigo-400" />
                <span className="text-gray-400">Panchal Vihar, Karawal Nagar Delhi-110094</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaPhone className="text-indigo-400" />
                <span className="text-gray-400">+91-9910960074</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaEnvelope className="text-indigo-400" />
                <span className="text-gray-400">info@shoppingcart.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors duration-300"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Shopping Cart. All rights reserved.</p>
        </div>
      </div>
   </footer>
  );
};

export default Footer;