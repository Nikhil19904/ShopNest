import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '../app/slices/authSlice'
import { setCart } from '../app/slices/cartSlice'
import getUserFromServer from '../helpers/getUserFromServer'

const Success = ({ getUser }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const updateUser = async () => {
      const data = await getUserFromServer()
      if (data.success) {
        dispatch(setUser(data.user))
        dispatch(setCart(data.user.cart))
      }
    }
    updateUser()
  }, [dispatch])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-500 mb-4">Payment Successful!</h1>
        <p className="text-xl mb-8">Thank you for your purchase.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  )
}

export default Success 