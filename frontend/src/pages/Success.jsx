import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaCheckCircle, FaShoppingBag, FaTruck } from 'react-icons/fa'
import PaymentSuccessSummary from '../components/PaymentSuccessSummary'
import LiveChatWidget from '../components/LiveChatWidget'

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
    
    // Check if order details were passed in state
    if (location.state && location.state.orderDetails) {
      setOrderDetails(location.state.orderDetails);
    }
  }, [location]);

  const handleTrackOrder = () => {
    if (orderDetails && orderDetails.orderId) {
      navigate(`/track-order/${orderDetails.orderId}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {orderDetails ? (
        <div className="w-full max-w-3xl">
          <PaymentSuccessSummary orderDetails={orderDetails} />
          <div className="mt-6 text-center">
            <button
              onClick={handleTrackOrder}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10 transition-colors duration-300"
            >
              <FaTruck className="mr-2" />
              Track Your Order
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-xl shadow-md">
          <div className="text-center">
            <FaCheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Payment Successful!
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
          </div>

          <div className="mt-8">
            <div className="rounded-md shadow">
              <Link
                to="/products"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-colors duration-300"
              >
                <FaShoppingBag className="mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
      <LiveChatWidget />
    </div>
  )
}

export default Success 