import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import CartItem from '../components/CartItem'
import toast from "react-hot-toast"
import { Link } from 'react-router-dom'
import { FaTrash, FaPlus, FaMinus, FaArrowLeft } from 'react-icons/fa'

const Cart = () => {
  const user = useSelector((state) => state.auth.user)
  const items = useSelector((state) => state.cart.cart)
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  
  const [loading,setLoading] = useState(false)

  const orderNow = async() =>{
    try{
      setLoading(true)
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/cart/checkout`,{
        method:"POST",
        
        headers:{
          "Content-Type":"application/json"
        },
        credentials:'include',
        body:JSON.stringify({items})
      })
  
      const data = await res.json()
      if (data.success) {
        window.location.href = data.url; 
      } else {
        toast.error('Order failed: ' + data.message);
      }
    }catch(error){
      toast.error('Order failed: ' + error.message);
    }finally{
      setLoading(false)
    }
  }

  if (!user) {
    return <p className='text-center text-lg my-5'>You are not logged in.</p>
  }

  if (items.length === 0) {
    return <div className='flex flex-col items-center justify-center p-5'>

      <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-7359557-6024626.png?f=webp" alt="cart" loading='lazy' />
      <p className='text-lg'>Your cart is empty.</p>

    </div>
  }

  const updateQuantity = (id, change) => {
    // Implementation of updateQuantity function
  };

  const removeItem = (id) => {
    // Implementation of removeItem function
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 10.00;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
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
                    alt={item.name}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                  />
                </div>
        
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {item.name}
                  </h3>
                  <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                    ${item.price.toFixed(2)}
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
        </div>

                <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl">
                  Proceed to Checkout
                </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart