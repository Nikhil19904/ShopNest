import React, { useState } from 'react';
import { FaLock, FaCreditCard } from 'react-icons/fa';

const PaymentForm = ({ onSubmit, isLoading }) => {
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formattedValue = value
        .replace(/\s/g, '')
        .replace(/\D/g, '')
        .slice(0, 16)
        .replace(/(.{4})/g, '$1 ')
        .trim();
      
      setCardInfo({ ...cardInfo, [name]: formattedValue });
      return;
    }
    
    // Format expiry date (MM/YY)
    if (name === 'expiryDate') {
      const formattedValue = value
        .replace(/\D/g, '')
        .slice(0, 4)
        .replace(/(\d{2})(\d{0,2})/, '$1/$2')
        .replace(/\/\//g, '/');
      
      setCardInfo({ ...cardInfo, [name]: formattedValue });
      return;
    }
    
    // Format CVV (numbers only, max 4 digits)
    if (name === 'cvv') {
      const formattedValue = value.replace(/\D/g, '').slice(0, 4);
      setCardInfo({ ...cardInfo, [name]: formattedValue });
      return;
    }
    
    setCardInfo({ ...cardInfo, [name]: value });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!cardInfo.cardNumber || cardInfo.cardNumber.replace(/\s/g, '').length < 16) {
      errors.cardNumber = 'Valid card number is required';
    }
    
    if (!cardInfo.cardHolder) {
      errors.cardHolder = 'Cardholder name is required';
    }
    
    if (!cardInfo.expiryDate || cardInfo.expiryDate.length < 5) {
      errors.expiryDate = 'Valid expiry date is required';
    } else {
      // Check if expiry date is valid (not expired)
      const [month, year] = cardInfo.expiryDate.split('/');
      const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const currentDate = new Date();
      
      if (expiryDate < currentDate) {
        errors.expiryDate = 'Card has expired';
      }
    }
    
    if (!cardInfo.cvv || cardInfo.cvv.length < 3) {
      errors.cvv = 'Valid CVV is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(cardInfo);
    }
  };

  const getCardType = () => {
    const cardNumber = cardInfo.cardNumber.replace(/\s/g, '');
    
    if (/^4/.test(cardNumber)) return 'Visa';
    if (/^5[1-5]/.test(cardNumber)) return 'MasterCard';
    if (/^3[47]/.test(cardNumber)) return 'American Express';
    if (/^6(?:011|5)/.test(cardNumber)) return 'Discover';
    
    return null;
  };

  const cardType = getCardType();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 mt-4">
      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={cardInfo.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                className={`w-full px-4 py-2 border ${formErrors.cardNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
              />
              <div className="absolute right-3 top-2.5 text-gray-400">
                <FaCreditCard />
              </div>
              {cardType && (
                <div className="absolute right-10 top-2.5 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  {cardType}
                </div>
              )}
            </div>
            {formErrors.cardNumber && (
              <p className="mt-1 text-sm text-red-600">{formErrors.cardNumber}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cardholder Name
            </label>
            <input
              type="text"
              id="cardHolder"
              name="cardHolder"
              value={cardInfo.cardHolder}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full px-4 py-2 border ${formErrors.cardHolder ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
            />
            {formErrors.cardHolder && (
              <p className="mt-1 text-sm text-red-600">{formErrors.cardHolder}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={cardInfo.expiryDate}
                onChange={handleChange}
                placeholder="MM/YY"
                className={`w-full px-4 py-2 border ${formErrors.expiryDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
              />
              {formErrors.expiryDate && (
                <p className="mt-1 text-sm text-red-600">{formErrors.expiryDate}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={cardInfo.cvv}
                onChange={handleChange}
                placeholder="123"
                className={`w-full px-4 py-2 border ${formErrors.cvv ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
              />
              {formErrors.cvv && (
                <p className="mt-1 text-sm text-red-600">{formErrors.cvv}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-70"
          >
            <FaLock className="mr-2" />
            {isLoading ? 'Processing...' : 'Pay Securely'}
          </button>
        </div>
        
        <div className="mt-4 flex items-center justify-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <FaLock className="mr-1" />
            Secured by SSL encryption
          </div>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm; 