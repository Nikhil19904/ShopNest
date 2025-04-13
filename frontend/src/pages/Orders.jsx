import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaShoppingBag, FaBox, FaTruck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { apiRequest } from '../utils/api';
import { ENDPOINTS } from '../config/api';
import toast from 'react-hot-toast';

const Orders = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await apiRequest('GET', ENDPOINTS.ORDERS.LIST);
      
      if (response.success) {
        setOrders(response.data?.orders || response.orders || []);
      } else if (response.statusCode === 404) {
        // If orders endpoint doesn't exist yet, show empty array
        setOrders([]);
      } else {
        toast.error(response.message || 'Failed to fetch orders');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred while fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <FaBox className="text-yellow-500" />;
      case 'processing':
        return <FaTruck className="text-blue-500" />;
      case 'completed':
        return <FaCheckCircle className="text-green-500" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaShoppingBag className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">My Orders</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <FaShoppingBag className="mx-auto text-5xl text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No Orders Yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't placed any orders yet. Start shopping to see your order history here.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="mb-4 md:mb-0">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Items</p>
                        <p className="text-lg font-medium text-gray-800 dark:text-white">{order.items.length}</p>
                      </div>
                      <div className="mb-4 md:mb-0">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                        <p className="text-lg font-medium text-gray-800 dark:text-white">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/order/${order._id}`)}
                            className="px-4 py-2 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => navigate(`/track-order/${order._id}`)}
                            className="px-4 py-2 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                          >
                            Track Order
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Order Items</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-md overflow-hidden mr-3">
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FaBox className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-white truncate max-w-xs">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            +{order.items.length - 3}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.items.length - 3} more items
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders; 