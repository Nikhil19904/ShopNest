import React from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 2199.99,
    rating: 4.8,
    reviews: 245,
    image: "/images/headphone.jpeg",
    category: "Electronics",
    isNew: true,
    discount: 15
  },
  {
    id: 2,
    name: "Smart Watch Pro",
    price: 799.99,
    rating: 4.9,
    reviews: 189,
    image: "/images/smart-watch.jpeg",
    category: "Electronics",
    isNew: true,
    discount: null
  },
  {
    id: 3,
    name: "Premium Backpack",
    price: 999.99,
    rating: 4.7,
    reviews: 156,
    image: "/images/backpack.jpeg",
    category: "Accessories",
    isNew: false,
    discount: 20
  },
  {
    id: 4,
    name: "Wireless Earbuds",
    price: 499.99,
    rating: 4.8,
    reviews: 312,
    image: "/images/earbuds.jpeg",
    category: "Electronics",
    isNew: false,
    discount: 20
  }
];

// Render star rating
const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {Array(fullStars).fill(0).map((_, i) => <AiFillStar key={i} className="text-yellow-400 w-4 h-4" />)}
      {halfStar && <AiFillStar className="text-yellow-400 w-4 h-4 opacity-50" />}
      {Array(emptyStars).fill(0).map((_, i) => <AiOutlineStar key={i} className="text-yellow-400 w-4 h-4 opacity-30" />)}
    </div>
  );
};

const FeaturedProducts = () => {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Featured Products
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Discover our handpicked selection of premium items
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden group relative"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden aspect-[4/3]">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Badges */}
                {product.isNew && (
                  <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                    New
                  </span>
                )}
                {product.discount && (
                  <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                    -{product.discount}%
                  </span>
                )}

                {/* Hover Actions */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg">
                  <button className="p-2 bg-white/30 rounded-full hover:bg-white/60 transition-colors shadow-md">
                    <FiHeart className="text-white w-5 h-5" />
                  </button>
                  <button className="p-2 bg-white/30 rounded-full hover:bg-white/60 transition-colors shadow-md">
                    <FiShoppingCart className="text-white w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-semibold text-base md:text-lg mb-1 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                
                {/* Rating */}
                <div className="flex items-center justify-between mb-2">
                  {renderStars(product.rating)}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price and Button */}
                <div className="flex items-center justify-between mt-3">
                  <div>
                    {product.discount ? (
                      <div className="flex flex-col">
                        <span className="text-blue-600 font-bold text-lg md:text-xl">
                          ${(product.price * (1 - product.discount/100)).toFixed(2)}
                        </span>
                        <span className="text-gray-400 dark:text-gray-500 line-through text-sm">
                          ${product.price}
                        </span>
                      </div>
                    ) : (
                      <span className="text-blue-600 font-bold text-lg md:text-xl">
                        ${product.price}
                      </span>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-yellow-400 text-black px-3 py-1.5 text-sm rounded hover:bg-yellow-500 transition-colors font-medium shadow-md"
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
