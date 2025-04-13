import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import toast from "react-hot-toast"
import { Link, useNavigate } from 'react-router-dom'
import { FaTrash, FaPlus, FaMinus, FaArrowLeft, FaCreditCard, FaPaypal, FaApplePay, FaGoogle, FaQrcode } from 'react-icons/fa'
import { incrementQuantity, decrementQuantity, removeFromCart } from '../app/slices/cartSlice'
import PaymentForm from '../components/PaymentForm'
import MockQRCode from '../components/MockQRCode'
import MockPaymentSummary from '../components/MockPaymentSummary'
import { apiRequest } from '../utils/api'
import { ENDPOINTS } from '../config/api'

// USD to INR conversion rate
const USD_TO_INR_RATE = 83.16; // As of current rate, update as needed

// Convert USD to INR
const convertToINR = (usdPrice) => {
    const inrPrice = usdPrice * USD_TO_INR_RATE;
    return inrPrice.toFixed(2);
};

const Cart = () => {
  const user = useSelector((state) => state.auth.user)
  const items = useSelector((state) => state.cart.cart)
  // const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [cardInfo, setCardInfo] = useState(null)
  const [showQRCode, setShowQRCode] = useState(false)
  const [mockPaymentData, setMockPaymentData] = useState(null)
  const [showPaymentSummary, setShowPaymentSummary] = useState(false)
  const [shippingAddress] = useState({
    name: user?.name || '',
    street: '123 Main St',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400001',
    country: 'India'
  })

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setShowPaymentForm(method === 'card' && !cardInfo);
  };

  const handleCardSubmit = (cardData) => {
    setCardInfo(cardData);
    setShowPaymentForm(false);
    toast.success('Card information saved');
  };

  // Load Razorpay script
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const orderNow = async() => {
    if (paymentMethod === 'card' && !cardInfo) {
      setShowPaymentForm(true);
      return;
    }

    // Show payment summary before proceeding
    setShowPaymentSummary(true);
  };
  
  const confirmPayment = async() => {
    try {
      setLoading(true);
      
      // Create order on backend
      const data = await apiRequest('POST', '/cart/checkout', {
        items,
        paymentMethod
      });
      
      if (data.success) {
        // Check if this is a mock payment (fallback when Razorpay isn't working)
        if (data.is_mock) {
          try {
            // Handle mock payment flow
            console.log("Using mock payment flow");
            
            // For QR code payment method, show the QR code component
            if (paymentMethod === 'qrcode') {
              setMockPaymentData({
                order_id: data.order_id,
                amount: data.amount,
                payment_id: data.mock_payment_id,
                signature: data.mock_signature
              });
              setShowQRCode(true);
              return;
            }
            
            // For other payment methods, continue with normal mock flow
            // Simulate payment verification
            const verifyData = await apiRequest('POST', '/cart/verify-payment', {
              razorpay_order_id: data.order_id,
              razorpay_payment_id: data.mock_payment_id,
              razorpay_signature: data.mock_signature,
              is_mock: true
            });
            
            if (verifyData.success) {
              // Clear cart and show success message
              items.forEach(item => dispatch(removeFromCart(item.id)));
              toast.success('Mock payment successful!');
              
              // Set success order details and navigate to success page
              const orderDetails = {
                orderId: data.order_id,
                total: data.amount / 100, // Convert from paise to rupees
                items: items,
                paymentMethod: paymentMethod === 'card' ? 'Credit Card' : 
                              paymentMethod === 'qrcode' ? 'QR Code' : 
                              paymentMethod === 'wallet' ? 'Wallet' : 'Cash on Delivery'
              };
              
              // Navigate to success page with order details
              navigate('/success', { state: { orderDetails } });
            } else {
              toast.error('Mock payment verification failed: ' + (verifyData.message || ''));
            }
          } catch (error) {
            console.error('Mock payment error:', error);
            toast.error('Mock payment failed: ' + error.message);
          }
          return;
        }
        
        // Regular Razorpay flow
        // Check for required fields
        if (!data.key_id || !data.order_id || !data.amount) {
          throw new Error('Missing payment gateway details');
        }
        
        // Load Razorpay script
        const isRazorpayLoaded = await loadRazorpay();
        
        if (!isRazorpayLoaded) {
          throw new Error('Failed to load payment gateway');
        }
        
        // Initialize Razorpay options
        const options = {
          key: data.key_id,
          amount: data.amount,
          currency: data.currency || 'INR',
          name: "Shopping Cart",
          description: "Purchase of items",
          order_id: data.order_id,
          handler: async function (response) {
            try {
              if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
                throw new Error('Invalid payment response');
              }
              
              // Verify payment on server
              const verifyData = await apiRequest('POST', '/cart/verify-payment', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });
              
              if (verifyData.success) {
                // Clear cart and show success message
                items.forEach(item => dispatch(removeFromCart(item.id)));
                toast.success('Payment successful!');
                
                // Set success order details and navigate to success page
                const orderDetails = {
                  orderId: response.razorpay_order_id,
                  total: data.amount / 100, // Convert from paise to rupees
                  items: items,
                  paymentMethod: paymentMethod === 'card' ? 'Credit Card' : 
                                paymentMethod === 'qrcode' ? 'QR Code' : 
                                paymentMethod === 'wallet' ? 'Wallet' : 'Cash on Delivery'
                };
                
                // Navigate to success page with order details
                navigate('/success', { state: { orderDetails } });
              } else {
                toast.error('Payment verification failed: ' + (verifyData.message || ''));
              }
            } catch (error) {
              console.error('Payment verification error:', error);
              toast.error('Payment verification failed: ' + error.message);
            }
          },
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
          },
          theme: {
            color: "#6366F1",
          },
          modal: {
            ondismiss: function() {
              setLoading(false);
              toast.error('Payment cancelled');
            }
          }
        };
        
        // Add QR code specific options if QR code payment method is selected
        if (paymentMethod === 'qrcode') {
          options.method = {
            netbanking: false,
            card: false,
            upi: true,
            wallet: false
          };
          options.config = {
            display: {
              hide: [
                { method: 'card' },
                { method: 'netbanking' },
                { method: 'wallet' }
              ],
              preferences: {
                show_default_blocks: false
              }
            }
          };
        }
        
        // Initialize Razorpay
        try {
          const razorpay = new window.Razorpay(options);
          razorpay.on('payment.failed', function (response) {
            setLoading(false);
            toast.error('Payment failed: ' + (response.error.description || response.error.reason || 'Unknown error'));
          });
          razorpay.open();
        } catch (razorpayError) {
          console.error('Razorpay initialization error:', razorpayError);
          throw new Error('Failed to initialize payment: ' + razorpayError.message);
        }
      } else {
        throw new Error(data.message || 'Failed to create order');
      }
    } catch(error) {
      console.error('Order failed:', error);
      toast.error('Order failed: ' + (error.message || 'Unknown error'));
      setLoading(false);
    }
  };

  // Handle successful QR code payment
  const handleQRCodeSuccess = async () => {
    try {
      if (!mockPaymentData) return;
      
      const verifyData = await apiRequest('POST', '/cart/verify-payment', {
        razorpay_order_id: mockPaymentData.order_id,
        razorpay_payment_id: mockPaymentData.payment_id,
        razorpay_signature: mockPaymentData.signature,
        is_mock: true
      });
      
      if (verifyData.success) {
        // Clear cart and show success message
        items.forEach(item => dispatch(removeFromCart(item.id)));
        toast.success('QR code payment successful!');
        
        // Set success order details and navigate to success page
        const orderDetails = {
          orderId: mockPaymentData.order_id,
          total: mockPaymentData.amount / 100, // Convert from paise to rupees
          items: items,
          paymentMethod: 'QR Code'
        };
        
        // Navigate to success page with order details
        navigate('/success', { state: { orderDetails } });
      } else {
        toast.error('Payment verification failed: ' + (verifyData.message || ''));
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      toast.error('Payment verification failed: ' + error.message);
    } finally {
      setLoading(false);
      setShowQRCode(false);
      setMockPaymentData(null);
    }
  };

  // Handle QR code payment cancellation
  const handleQRCodeCancel = () => {
    setShowQRCode(false);
    setLoading(false);
    setMockPaymentData(null);
    toast.error('Payment cancelled');
  };

  const getCardType = (cardNumber) => {
    const number = cardNumber.replace(/\s/g, '');
    
    if (/^4/.test(number)) return 'Visa';
    if (/^5[1-5]/.test(number)) return 'MasterCard';
    if (/^3[47]/.test(number)) return 'American Express';
    if (/^6(?:011|5)/.test(number)) return 'Discover';
    
    return 'Credit Card';
  };

  if (!user) {
    return <p className='text-center text-lg my-5'>You are not logged in.</p>
  }

  if (items.length === 0) {
    return <div className='flex flex-col items-center justify-center p-5'>
      <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-7359557-6024626.png?f=webp" alt="cart" loading='lazy' />
      <p className='text-lg'>Your cart is empty.</p>
    </div>
  }

  const updateQuantity = async (id, change) => {
    try {
      if (change > 0) {
        // Increment
        const data = await apiRequest('POST', `/cart/increment/${id}`);
        
        if (data.success) {
          dispatch(incrementQuantity(id));
          toast.success(data.message || "Quantity increased");
        } else {
          toast.error(data.message || "Failed to increase quantity");
        }
      } else {
        // Decrement
        const data = await apiRequest('POST', `/cart/decrement/${id}`);
        
        if (data.success) {
          dispatch(decrementQuantity(id));
          toast.success(data.message || "Quantity decreased");
        } else {
          toast.error(data.message || "Failed to decrease quantity");
        }
      }
    } catch (error) {
      toast.error("Something went wrong updating quantity");
      console.error(error);
    }
  };

  const removeItem = async (id) => {
    try {
      const data = await apiRequest('DELETE', `${ENDPOINTS.CART.REMOVE}/${id}`);
      
      if (data.success) {
        dispatch(removeFromCart(id));
        toast.success(data.message || "Item removed from cart");
      } else {
        toast.error(data.message || "Failed to remove item");
      }
    } catch (error) {
      toast.error("Something went wrong removing the item");
      console.error(error);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 10.00;
  const total = subtotal + shipping;

  const paymentMethods = [
    { id: 'card', name: 'Credit Card', icon: <FaCreditCard className="text-blue-500" /> },
    { id: 'qrcode', name: 'QR Code', icon: <FaQrcode className="text-purple-500" /> },
    { id: 'paypal', name: 'PayPal', icon: <FaPaypal className="text-blue-700" /> },
    { id: 'applepay', name: 'Apple Pay', icon: <FaApplePay /> },
    { id: 'googlepay', name: 'Google Pay', icon: <FaGoogle className="text-green-500" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-20 pb-12">
      {/* Payment Summary Modal */}
      {showPaymentSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <MockPaymentSummary 
            items={items}
            total={items.reduce((total, item) => total + item.price * item.quantity, 0)}
            paymentMethod={paymentMethod}
            cardInfo={cardInfo}
            shippingAddress={shippingAddress}
            isLoading={loading}
            onConfirm={() => {
              setShowPaymentSummary(false);
              confirmPayment();
            }}
            onCancel={() => setShowPaymentSummary(false)}
          />
        </div>
      )}
      
      {/* Payment Form Dialog */}
      {showPaymentForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-w-md w-full">
            <PaymentForm 
              onSubmit={handleCardSubmit} 
              isLoading={loading}
            />
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setShowPaymentForm(false)}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* QR Code Dialog */}
      {showQRCode && mockPaymentData && (
        <MockQRCode
          orderId={mockPaymentData.order_id}
          amount={mockPaymentData.amount}
          onSuccess={handleQRCodeSuccess}
          onCancel={handleQRCodeCancel}
        />
      )}
      
      <div className="container mx-auto px-4">
        <Link 
          to="/products" 
          className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-8 transition-colors duration-300"
        >
          <FaArrowLeft className="mr-2" />
          Continue Shopping
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div 
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex items-center"
              >
                <div className="w-24 h-24 rounded-lg overflow-hidden mr-6">
                  <img 
                    src={item.image} 
                    alt={item.title || 'Product image'}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                  />
                </div>
        
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {item.title || item.name}
                  </h3>
                  <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                    ₹{convertToINR(typeof item.price === 'number' ? item.price : parseFloat(item.price))}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-1">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
                    >
                      <FaMinus />
                    </button>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
                    >
                      <FaPlus />
                    </button>
                  </div>

                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-600 transition-colors duration-300"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-20">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span>₹{convertToINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Shipping</span>
                  <span>₹{convertToINR(shipping)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>₹{convertToINR(total)}</span>
                  </div>
                </div>
                
                {/* Payment Methods */}
                <div className="mt-6">
                  <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Payment Method</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {paymentMethods.map((method) => (
                      <div 
                        key={method.id}
                        onClick={() => handlePaymentMethodChange(method.id)}
                        className={`cursor-pointer flex flex-col items-center justify-center p-3 rounded-lg border ${
                          paymentMethod === method.id 
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' 
                            : 'border-gray-200 dark:border-gray-700'
                        } transition-all duration-200 hover:border-indigo-300 dark:hover:border-indigo-700`}
                      >
                        <div className="text-2xl mb-1">{method.icon}</div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{method.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Information Summary */}
                {paymentMethod === 'card' && cardInfo && !showPaymentForm && (
                  <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FaCreditCard className="text-indigo-600 mr-2" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {getCardType(cardInfo.cardNumber)} •••• {cardInfo.cardNumber.slice(-4)}
                        </span>
                      </div>
                      <button 
                        onClick={() => setShowPaymentForm(true)}
                        className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                )}

                {/* Only show checkout button if payment form is not showing or a payment method other than card is selected */}
                {(!showPaymentForm || paymentMethod !== 'card') && (
                  <button 
                    onClick={orderNow}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-70"
                  >
                    {loading ? 'Processing...' : 'Proceed to Checkout'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart