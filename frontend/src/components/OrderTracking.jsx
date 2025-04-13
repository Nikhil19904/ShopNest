import React from 'react';
import { FaBox, FaTruck, FaCheckCircle, FaShippingFast, FaHome } from 'react-icons/fa';
import { motion } from 'framer-motion';

const OrderTracking = ({ orderStatus, estimatedDelivery, orderId }) => {
  // Define the possible order statuses and their details
  const statuses = [
    { 
      id: 'ordered', 
      label: 'Order Placed', 
      icon: <FaBox />,
      description: 'Your order has been confirmed'
    },
    { 
      id: 'processing', 
      label: 'Processing', 
      icon: <FaShippingFast />,
      description: 'We are preparing your order'
    },
    { 
      id: 'shipped', 
      label: 'Shipped', 
      icon: <FaTruck />,
      description: 'Your order is on the way'
    },
    { 
      id: 'delivered', 
      label: 'Delivered', 
      icon: <FaHome />,
      description: 'Order has been delivered'
    },
    { 
      id: 'completed', 
      label: 'Completed', 
      icon: <FaCheckCircle />,
      description: 'Order has been completed'
    }
  ];

  // Find the current status index
  const currentStatusIndex = statuses.findIndex(status => status.id === orderStatus);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Tracking</h2>
        <p className="text-gray-600 dark:text-gray-300">Order ID: {orderId}</p>
        {estimatedDelivery && (
          <p className="text-gray-600 dark:text-gray-300">
            Estimated Delivery: {new Date(estimatedDelivery).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Status Timeline */}
      <div className="relative">
        {/* Progress Bar */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2">
          <motion.div 
            className="h-full bg-indigo-600"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {/* Status Points */}
        <div className="relative flex justify-between">
          {statuses.map((status, index) => {
            const isActive = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;
            
            return (
              <div key={status.id} className="flex flex-col items-center">
                <motion.div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    isActive 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  } ${isCurrent ? 'ring-4 ring-indigo-300 dark:ring-indigo-900' : ''}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {status.icon}
                </motion.div>
                <div className="text-center">
                  <p className={`text-sm font-medium ${
                    isActive 
                      ? 'text-indigo-600 dark:text-indigo-400' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {status.label}
                  </p>
                  {isCurrent && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {status.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Status Information */}
      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Current Status</h3>
        <p className="text-gray-600 dark:text-gray-300">
          {statuses[currentStatusIndex].description}
        </p>
        {orderStatus === 'shipped' && (
          <div className="mt-4">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-1">Tracking Details</h4>
            <p className="text-gray-600 dark:text-gray-300">
              Your package is in transit. You will receive updates as your order moves through our delivery network.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking; 