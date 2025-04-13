import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTimesCircle, FaArrowLeft } from 'react-icons/fa';

const Cancel = () => {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-xl shadow-md">
        <div className="text-center">
          <FaTimesCircle className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Payment Cancelled
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Your payment was cancelled. Don't worry, your items are still in your cart.
          </p>
        </div>

        <div className="mt-8">
          <div className="rounded-md shadow">
            <Link
              to="/cart"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-colors duration-300"
            >
              <FaArrowLeft className="mr-2" />
              Return to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cancel;
