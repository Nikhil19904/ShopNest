import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { FaStar, FaHeart, FaSpinner } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { useCart } from '../context/CartContext'
import { request } from '../utils/request'
import { toast } from 'react-toastify'
import ProductGallery from './ProductGallery'

// USD to INR conversion rate
const USD_TO_INR_RATE = 83.16; // As of current rate, update as needed

const Product = ({ product }) => {
    const { user } = useSelector(state => state.auth)
    const { addToCart } = useCart()
    const [isInWishlist, setIsInWishlist] = useState(false)
    const [isWishlistLoading, setIsWishlistLoading] = useState(false)
    const [isAddingToCart, setIsAddingToCart] = useState(false)
    const [rating, setRating] = useState(null)

    // Convert USD to INR
    const convertToINR = (usdPrice) => {
        const inrPrice = usdPrice * USD_TO_INR_RATE;
        return inrPrice.toFixed(2);
    };
    
    const fetchProductRating = useCallback(async () => {
        try {
            const response = await request(`/api/ratings/product/${product._id}/average`);
            if (response.success) {
                setRating(response.data.averageRating);
            }
        } catch (error) {
            console.error('Error fetching product rating:', error);
        }
    }, [product]);
    
    const checkWishlistStatus = useCallback(async () => {
        try {
            setIsWishlistLoading(true);
            const response = await request(`/api/wishlist/check/${product._id}`);
            if (response.success) {
                setIsInWishlist(response.data.isInWishlist);
            }
        } catch (error) {
            console.error('Error checking wishlist status:', error);
        } finally {
            setIsWishlistLoading(false);
        }
    }, [product]);
    
    useEffect(() => {
        if (user && product) {
            checkWishlistStatus();
            fetchProductRating();
        }
    }, [user, product, checkWishlistStatus, fetchProductRating]);
    
    const toggleWishlist = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.info('Please login to add items to your wishlist');
            return;
        }

        try {
            setIsWishlistLoading(true);
            const endpoint = isInWishlist ? `/api/wishlist/remove/${product._id}` : '/api/wishlist/add';
            const method = isInWishlist ? 'DELETE' : 'POST';
            const body = isInWishlist ? null : { productId: product._id };

            const response = await request(endpoint, {
                method,
                body: body ? JSON.stringify(body) : null,
            });

            if (response.success) {
                setIsInWishlist(!isInWishlist);
                toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            toast.error('Failed to update wishlist');
        } finally {
            setIsWishlistLoading(false);
        }
    };
    
    const handleAddToCart = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.info('Please login to add items to your cart');
            return;
        }

        try {
            setIsAddingToCart(true);
            await addToCart(product._id, 1);
            toast.success('Added to cart');
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add to cart');
        } finally {
            setIsAddingToCart(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <Link to={`/product/${product._id}`} className="block">
                <div className="relative">
                    <ProductGallery product={product} />
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{product.title}</h3>
                    <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                    key={star}
                                    className={star <= (rating || 0) ? 'text-yellow-400' : 'text-gray-300'}
                                />
                            ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                            {rating ? rating.toFixed(1) : 'No ratings'}
                        </span>
                    </div>
                    <p className="text-xl font-bold text-[var(--primary)] mb-2">₹{convertToINR(product.price)}</p>
                    <div className="flex justify-between items-center">
                        <button
                            onClick={handleAddToCart}
                            disabled={isAddingToCart}
                            className="px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--primary-dark)] disabled:opacity-50"
                        >
                            {isAddingToCart ? <FaSpinner className="animate-spin" /> : 'Add to Cart'}
                        </button>
                        <button
                            onClick={toggleWishlist}
                            disabled={isWishlistLoading}
                            className={`p-2 rounded-full ${
                                isInWishlist
                                    ? 'text-red-500 hover:text-red-600'
                                    : 'text-gray-400 hover:text-red-500'
                            }`}
                        >
                            {isWishlistLoading ? <FaSpinner className="animate-spin" /> : <FaHeart />}
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default Product