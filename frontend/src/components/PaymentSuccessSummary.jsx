// import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag, FaHome} from 'react-icons/fa';

const PaymentSuccessSummary = ({ orderDetails }) => {
  // Default values if orderDetails is not provided
  const {
    orderId = 'ORD-' + Math.floor(Math.random() * 1000000),
    total = 0,
    items = [],
    estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    paymentMethod = 'Credit Card'
  } = orderDetails || {};

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <FaCheckCircle className="text-green-500 text-6xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h2>
        <p className="text-gray-600 dark:text-gray-300">Thank you for your purchase. Your order has been confirmed.</p>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 dark:text-gray-400">Order ID:</span>
          <span className="font-medium text-gray-900 dark:text-white">{orderId}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
          <span className="font-medium text-gray-900 dark:text-white">{paymentMethod}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
          <span className="font-medium text-gray-900 dark:text-white">₹{total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Estimated Delivery:</span>
          <span className="font-medium text-gray-900 dark:text-white">{estimatedDelivery}</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Order Summary</h3>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-12 h-12 rounded-md overflow-hidden mr-3">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Quantity: {item.quantity}</p>
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                ₹{(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link 
          to="/orders" 
          className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <FaShoppingBag className="mr-2" />
          View Orders
        </Link>
        <Link 
          to="/" 
          className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <FaHome className="mr-2" />
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccessSummary; 