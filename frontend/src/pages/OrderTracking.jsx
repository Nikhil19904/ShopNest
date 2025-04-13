import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSearch, FaArrowLeft } from 'react-icons/fa';
import { apiRequest } from '../utils/api';
import OrderTracking from '../components/OrderTracking';
import toast from 'react-hot-toast';

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [searchOrderId, setSearchOrderId] = useState(orderId || '');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderStatus(orderId);
    }
  }, [orderId]);

  const fetchOrderStatus = async (id) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest('GET', `/orders/track/${id}`);
      
      if (response.success) {
        setOrderData(response.order);
      } else {
        setError(response.message || 'Failed to fetch order status');
        toast.error(response.message || 'Failed to fetch order status');
      }
    } catch (error) {
      console.error('Error fetching order status:', error);
      setError('An error occurred while fetching order status');
      toast.error('An error occurred while fetching order status');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchOrderId.trim()) {
      navigate(`/track-order/${searchOrderId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 dark:text-indigo-400 mb-6 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Track Your Order</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Enter your order ID to track the status of your order.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              placeholder="Enter your order ID"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >
              <FaSearch className="mr-2" />
              Track Order
            </button>
          </form>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
              Please check your order ID and try again.
            </p>
          </div>
        )}

        {orderData && !loading && (
          <OrderTracking 
            orderStatus={orderData.status}
            estimatedDelivery={orderData.estimatedDelivery}
            orderId={orderData.orderId}
          />
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage; 