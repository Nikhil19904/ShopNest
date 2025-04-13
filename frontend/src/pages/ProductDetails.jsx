import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from "react-hot-toast"
import {useDispatch, useSelector} from "react-redux"
import Loader from '../components/Loader'
import { addToCart } from '../app/slices/cartSlice'
import { FaStar, FaShoppingCart, FaSpinner, FaTag } from 'react-icons/fa'
import localProducts from '../data/products'
import apiRequest from '../utils/api'

// USD to INR conversion rate
const USD_TO_INR_RATE = 83.16; // As of current rate, update as needed

// Convert USD to INR
const convertToINR = (usdPrice) => {
    const inrPrice = usdPrice * USD_TO_INR_RATE;
    return inrPrice.toFixed(2);
};

const ProductDetails = () => {
    const {id} = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [imageLoaded, setImageLoaded] = useState(false)
    const [imageError, setImageError] = useState(false)
    const [userRating, setUserRating] = useState(0)
    const [userReview, setUserReview] = useState('')
    const [hoverRating, setHoverRating] = useState(0)
    const [productRatings, setProductRatings] = useState({ ratings: [], stats: { count: 0, average: 0 } })
    const [loadingRatings, setLoadingRatings] = useState(false)
    const [submittingRating, setSubmittingRating] = useState(false)
    const user = useSelector(state=>state.auth.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // Define fetchProductRatings with useCallback
    const fetchProductRatings = useCallback(async () => {
        if (!product) return;
        
        try {
            setLoadingRatings(true);
            const data = await apiRequest(`http://localhost:3000/api/ratings/product/${product.id}`);
            if (data.success) {
                setProductRatings(data.data);
            }
        } catch (error) {
            console.error("Error fetching product ratings:", error);
        } finally {
            setLoadingRatings(false);
        }
    }, [product]);

    // Define fetchUserRating with useCallback
    const fetchUserRating = useCallback(async () => {
        if (!product || !user) return;
        
        try {
            const data = await apiRequest(`http://localhost:3000/api/ratings/user/${product.id}`);
            if (data.success) {
                setUserRating(data.rating.rating);
                setUserReview(data.rating.review || '');
            }
        } catch (error) {
            // User hasn't rated this product yet, that's fine
            console.log("User hasn't rated this product yet");
        }
    }, [product, user]);

    useEffect(()=>{
        const fetchProduct = async() =>{
            try{
                setLoading(true)
                
                // First check if product exists in local data
                const localProduct = localProducts.find(p => p.id === parseInt(id))
                
                if (localProduct) {
                    setProduct(localProduct)
                } else {
                    // If not found locally, fetch from API
                    const res = await fetch(`https://fakestoreapi.com/products/${id}`)
                    const data = await res.json()
                    setProduct(data)
                }
            }catch(error){
                console.log("Error fetching product:", error)
            }finally{
                setLoading(false)
            }
        }
        fetchProduct()
    },[id])

    useEffect(() => {
        if (product) {
            fetchProductRatings();
            if (user) {
                fetchUserRating();
            }
        }
    }, [product, user, fetchProductRatings, fetchUserRating]);

    const handleRatingSubmit = async () => {
        if (!user) {
            return toast.error("Please login to rate this product");
        }
        
        if (userRating === 0) {
            return toast.error("Please select a rating");
        }
        
        try {
            setSubmittingRating(true);
            const data = await apiRequest(`http://localhost:3000/api/ratings/add`, {
                method: "POST",
                body: JSON.stringify({
                    productId: product.id,
                    rating: userRating,
                    review: userReview
                })
            });
            
            if (data.success) {
                toast.success(data.message);
                // Refresh product ratings
                fetchProductRatings();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message || "Failed to submit rating");
        } finally {
            setSubmittingRating(false);
        }
    };

    const handleAddToCart = async() =>{
        if(!user){
            return toast.error("You are not logged in.")
        }
        try{
            const data = await apiRequest(`http://localhost:3000/api/cart/add`, {
                method: "POST",
                body: JSON.stringify(product)
            });
            
            if(data.success){
                toast.success(data.message)
                dispatch(addToCart({
                    id: product.id,
                    title: product.title,
                    description: product.description,
                    image: product.image,
                    price: product.price,
                }))
                navigate("/cart")
            } else {
                toast.error(data.message)
            }
        } catch(error){
            toast.error(error.message)
            console.log(error)
        }
    }

    // Function to render star ratings
    const renderRating = () => {
        // Use average rating from API or fallback to product rating or default to 0
        const rating = productRatings.stats.count > 0 
            ? productRatings.stats.average 
            : (product?.rating?.rate || 0);
            
        const reviewCount = productRatings.stats.count > 0 
            ? productRatings.stats.count 
            : (product?.rating?.count || 0);
            
        return (
            <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                    <FaStar 
                        key={i} 
                        className={`w-5 h-5 ${i < Math.round(rating) ? 'text-[var(--warning)]' : 'text-gray-300'}`} 
                    />
                ))}
                <span className="text-sm text-gray-500 ml-2">
                    ({rating.toFixed(1)}) - {reviewCount} reviews
                </span>
            </div>
        );
    }

    // Interactive rating component for users
    const renderRatingInput = () => {
        return (
            <div>
                <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => {
                        const ratingValue = i + 1;
                        return (
                            <FaStar 
                                key={i} 
                                className={`w-8 h-8 cursor-pointer transition-colors duration-200 ${
                                    (hoverRating || userRating) >= ratingValue 
                                        ? 'text-[var(--warning)]' 
                                        : 'text-gray-300'
                                }`}
                                onClick={() => setUserRating(ratingValue)}
                                onMouseEnter={() => setHoverRating(ratingValue)}
                                onMouseLeave={() => setHoverRating(0)}
                            />
                        );
                    })}
                    {userRating > 0 && (
                        <span className="text-sm font-medium ml-2">
                            Your rating: {userRating}/5
                        </span>
                    )}
                </div>
                <textarea
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                    rows="3"
                    placeholder="Write your review (optional)"
                    value={userReview}
                    onChange={(e) => setUserReview(e.target.value)}
                ></textarea>
                <button
                    className="mt-2 btn-primary text-white py-2 px-4 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleRatingSubmit}
                    disabled={submittingRating || userRating === 0}
                >
                    {submittingRating ? (
                        <>
                            <FaSpinner className="animate-spin mr-2" />
                            Submitting...
                        </>
                    ) : (
                        'Submit Rating'
                    )}
                </button>
            </div>
        );
    };

    // Render product reviews
    const renderReviews = () => {
        if (loadingRatings) {
            return (
                <div className="flex justify-center py-4">
                    <FaSpinner className="animate-spin text-[var(--primary)] w-6 h-6" />
                </div>
            );
        }

        if (productRatings.ratings.length === 0) {
            return (
                <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                    No reviews yet. Be the first to review this product!
                </div>
            );
        }

        return (
            <div className="space-y-4 mt-4">
                {productRatings.ratings.map((rating, index) => (
                    <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center mb-2">
                            <div className="font-medium text-gray-800 dark:text-white">
                                {rating.userId?.name || 'Anonymous'}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                {new Date(rating.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                        <div className="flex items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                                <FaStar 
                                    key={i} 
                                    className={`w-4 h-4 ${i < rating.rating ? 'text-[var(--warning)]' : 'text-gray-300'}`} 
                                />
                            ))}
                        </div>
                        {rating.review && (
                            <p className="text-gray-600 dark:text-gray-300">{rating.review}</p>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    if(loading){
        return <Loader/>
    }
    if(!product){
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-gray-600 dark:text-gray-300">Product not found.</p>
            </div>
        );
    }

    return (
        <section className="min-h-screen w-full py-12 pt-32 bg-gray-50 dark:bg-gray-900">
            <div className="container px-4 mx-auto">
                <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-2/5 relative">
                            <div 
                                className="bg-gray-100 dark:bg-gray-900/50 p-8 flex items-center justify-center overflow-hidden"
                                style={{ height: '400px' }}
                            >
                                {!imageLoaded && !imageError ? (
                                    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg w-full h-full" />
                                ) : (
                                    <div className="relative h-full w-full">
                                        <img
                                            alt={product.title}
                                            className={`absolute w-full h-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                            src={product.image}
                                            onLoad={() => setImageLoaded(true)}
                                            onError={() => setImageError(true)}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="text-center p-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900">
                                Product Image
                            </div>
                        </div>
                        <div className="md:w-3/5 p-8">
                            <div className="mb-2 flex flex-wrap gap-2">
                                <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-[var(--primary-light)]/10 text-[var(--primary)] dark:text-[var(--primary-light)]">
                                    {product.category}
                                </span>
                                
                                {product.subcategory && (
                                    <span className="inline-flex items-center px-3 py-1 text-xs font-semibold tracking-wider rounded-full bg-[var(--accent)]/10 text-[var(--accent)] dark:text-[var(--accent-light)]">
                                        <FaTag className="mr-1 w-3 h-3" />
                                        {product.subcategory}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                {product.title}
                            </h1>
                            
                            {renderRating()}
                            
                            <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                                <span className="text-3xl font-bold text-[var(--primary)] dark:text-[var(--primary-light)] mb-4 sm:mb-0">
                                    ₹{convertToINR(product.price)}
                                </span>
                                <button 
                                    onClick={handleAddToCart}
                                    className="btn-primary text-white py-3 px-8 rounded-lg flex items-center justify-center hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                                >
                                    <FaShoppingCart className="mr-2" />
                                    Add to Cart
                                </button>
                            </div>
                            
                            {/* User rating section */}
                            <div className="mt-8">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    Rate this product
                                </h3>
                                {user ? renderRatingInput() : (
                                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
                                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                                            Please login to rate this product
                                        </p>
                                        <button
                                            onClick={() => navigate('/login')}
                                            className="btn-primary text-white py-2 px-4 rounded-lg inline-block"
                                        >
                                            Login
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Product reviews section */}
                    <div className="p-8 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Customer Reviews
                        </h3>
                        {renderReviews()}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ProductDetails