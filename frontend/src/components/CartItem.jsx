import React from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { decrementQuantity, incrementQuantity, removeFromCart } from '../app/slices/cartSlice'
import apiRequest from '../utils/api'

// USD to INR conversion rate
const USD_TO_INR_RATE = 83.16; // As of current rate, update as needed

// Convert USD to INR
const convertToINR = (usdPrice) => {
    const inrPrice = usdPrice * USD_TO_INR_RATE;
    return inrPrice.toFixed(2);
};

const CartItem = ({ item }) => {
    const dispatch = useDispatch()
    const handleRemoveFromCart = async () => {
        try {
            const data = await apiRequest(`http://localhost:3000/api/cart/remove/${item.id}`, {
                method: "DELETE"
            });

            if (data.success) {
                dispatch(removeFromCart(item.id))
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error("Something went wrong.")
            console.log(error)
        }
    }
    const handleIncrement = async () => {
        try {
            const data = await apiRequest(`http://localhost:3000/api/cart/increment/${item.id}`, {
                method: "POST"
            });

            if (data.success) {
                toast.success(data.message)
                dispatch(incrementQuantity(item.id))
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error("Something went wrong.")
            console.log(error)
        }
    }
    const handleDecrement = async () => {
        try {
            const data = await apiRequest(`http://localhost:3000/api/cart/decrement/${item.id}`, {
                method: "POST"
            });

            if (data.success) {
                toast.success(data.message)
                dispatch(decrementQuantity(item.id))
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error("Something went wrong.")
            console.log(error)
        }
    }

    return (


        <div className="flex items-center gap-3 lg:p-5 p-3 my-2 rounded-lg relative  border cursor-pointer">
            
                <img src={item.image} alt={item.title} width={100} />
           
            <div className="flex flex-col items-start gap-3">
                <button className='bg-red-500 text-white px-2    py-1 rounded-lg absolute right-2 top-2' onClick={handleRemoveFromCart}>X</button>
                <h2 className="text-lg font-medium">
                    {item.title}
                </h2>

                <div className='flex justify-between  items-center  gap-5 '>
                    <p className='text-lg font-semibold'>₹ {convertToINR(item.price * item.quantity)}</p>

                </div>
                <div className='flex items-center gap-3'>
                <button className='text-2xl px-2  bg-red-500 text-white rounded-lg' onClick={handleDecrement}>-</button>
               
               <span className='text-lg'>{item?.quantity}</span>
          
           
               <button className='text-2xl px-2 bg-green-500 text-white rounded-lg' onClick={handleIncrement}>+</button>
                </div>
                
            </div>
        </div>

    )
}

export default CartItem