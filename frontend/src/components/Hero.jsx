import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Welcome to Our Store</h1>
                <p className="text-xl mb-8">Discover amazing products at great prices</p>
                <Link to="/products" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                    Shop Now
                </Link>
            </div>
        </div>
    )
}

export default Hero