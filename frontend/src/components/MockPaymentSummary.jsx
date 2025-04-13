import React from 'react';
import { FaCreditCard, FaMoneyBill, FaQrcode, FaShoppingBag, FaTruck } from 'react-icons/fa';

const MockPaymentSummary = ({ 
  items, 
  total, 
  paymentMethod, 
  onConfirm, 
  onCancel, 
  cardInfo,
  shippingAddress,
  isLoading 
}) => {
  // Helper function to get payment method icon and text
  const getPaymentMethod = () => {
    switch(paymentMethod) {
      case 'card':
        return {
          icon: <FaCreditCard className="text-indigo-500" />,
          text: cardInfo ? `${cardInfo.cardNumber.slice(-4).padStart(16, '•').replace(/(.{4})/g, '$1 ')}` : 'Credit Card'
        };
      case 'cash':
        return {
          icon: <FaMoneyBill className="text-green-500" />,
          text: 'Cash on Delivery'
        };
      case 'qrcode':
        return {
          icon: <FaQrcode className="text-blue-500" />,
          text: 'UPI / QR Payment'
        };
      default:
        return {
          icon: <FaCreditCard className="text-gray-500" />,
          text: 'Payment Method'
        };
    }
  };

  // Calculate subtotal, tax, and shipping costs
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const tax = subtotal * 0.1; // 10% tax
  const totalAmount = subtotal + shippingCost + tax;

  const paymentDetails = getPaymentMethod();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order Summary</h2>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      {/* Items Section */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
          <FaShoppingBag className="mr-2" /> Order Items
        </h3>
        <div className="space-y-3 max-h-40 overflow-y-auto">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden mr-3">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-600">
                      <span className="text-xs text-gray-600 dark:text-gray-400">No img</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white truncate max-w-[150px]">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Section */}
      {shippingAddress && (
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <FaTruck className="mr-2" /> Shipping Address
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <p className="text-sm text-gray-800 dark:text-gray-200">{shippingAddress.name}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{shippingAddress.street}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{shippingAddress.country}</p>
          </div>
        </div>
      )}

      {/* Payment Method */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Method</h3>
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded flex items-center">
          <span className="mr-2">{paymentDetails.icon}</span>
          <span className="text-sm text-gray-800 dark:text-gray-200">{paymentDetails.text}</span>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
          <span className="text-gray-800 dark:text-gray-200">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Shipping</span>
          <span className="text-gray-800 dark:text-gray-200">
            {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Tax (10%)</span>
          <span className="text-gray-800 dark:text-gray-200">${tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2 flex justify-between">
          <span className="font-medium text-gray-900 dark:text-white">Total</span>
          <span className="font-bold text-lg text-gray-900 dark:text-white">${totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-70"
        >
          {isLoading ? 'Processing...' : 'Confirm Payment'}
        </button>
      </div>

      {/* Security Notice */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Your payment information is encrypted and secure
        </p>
      </div>
    </div>
  );
};

export default MockPaymentSummary; 