import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const MockQRCode = ({ orderId, amount, onSuccess, onCancel }) => {
  const [countdown, setCountdown] = useState(15);
  const [paymentComplete, setPaymentComplete] = useState(false);
  
  // Create a countdown timer to simulate payment processing
  useEffect(() => {
    if (countdown > 0 && !paymentComplete) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !paymentComplete) {
      setPaymentComplete(true);
      onSuccess && onSuccess();
    }
  }, [countdown, paymentComplete, onSuccess]);
  
  // Handle cancel button click
  const handleCancel = () => {
    onCancel && onCancel();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Scan QR Code to Pay
          </h3>
          <button 
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        
        <div className="p-5">
          <div className="flex flex-col items-center">
            {paymentComplete ? (
              <div className="flex flex-col items-center py-6">
                <FaCheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <p className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  Payment Successful!
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Thank you for your payment
                </p>
              </div>
            ) : (
              <>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4 w-64 h-64 flex items-center justify-center">
                  {/* Mock QR code pattern */}
                  <div className="grid grid-cols-10 grid-rows-10 gap-1 w-full h-full p-4">
                    {Array.from({ length: 100 }).map((_, index) => (
                      <div 
                        key={index}
                        className={`${Math.random() > 0.7 ? 'bg-black dark:bg-white' : 'bg-white dark:bg-black'} 
                                   ${index === 22 || index === 27 || index === 72 || index === 77 ? 'bg-black dark:bg-white' : ''}`}
                      ></div>
                    ))}
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-1">
                    Amount: ₹{(amount / 100).toFixed(2)}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-1">
                    Order ID: {orderId}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Scan this QR code using any UPI app
                  </p>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${((15 - countdown) / 15) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Auto-completing in {countdown} seconds...
                </p>
              </>
            )}
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between">
            <button 
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
            >
              Cancel
            </button>
            
            {paymentComplete && (
              <button 
                onClick={() => onSuccess && onSuccess()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockQRCode; 