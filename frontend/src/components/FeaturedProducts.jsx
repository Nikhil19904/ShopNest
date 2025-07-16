import React from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 2199.99,
    rating: 4.8,
    reviews: 245,
    image: "public/images/headphone.jpeg",
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
    image: "public/images/smart-watch.jpeg",
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
    image: "public/images/backpack.jpeg",
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
    image: "public/images/earbuds.jpeg",
    category: "Electronics",
    isNew: false,
    discount: 20
  },
  {
    id: 5,
    name: "LED TV",
    price: 4099.99,
    rating: 4.5,
    reviews: 295,
    image: "public/images/led-tv.jpeg",
    category: "Electronics",
    isNew: false,
    discount: 23
  },
  {
    id: 6,
    name: "Grocery Kit",
    price: 699.99,
    rating: 4.6,
    reviews: 187,
    image: "public/images/grocery.jpeg",
    category: "Grocery",
    isNew: false,
    discount: 15
  },

  {
    id: 7,
    name: "Apple iphone Pro",
    price: 61099.99,
    rating: 4.9,
    reviews: 487,
    image: "public/images/iphone.jpeg",
    category: "Mobile Phone",
    isNew: false,
    discount: 30
  },
   {
    id: 8,
    name: "Women Jeans",
    price: 3199.99,
    rating: 4.2,
    reviews: 197,
    image: "public/images/women-jeans.jpeg",
    category: "Clothes",
    isNew: false,
    discount: 21
  }
];

const FeaturedProducts = () => {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4">
        {/* Section Header - reduced margin bottom */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">
            Featured Products
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Discover our handpicked selection of premium items
          </p>
        </motion.div>

        {/* Products Grid - adjusted gap */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden group dark:shadow-gray-700/30"
            >
              {/* Product Image - reduced height */}
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {product.isNew && (
                  <div className="absolute top-4 left-4 bg-blue-500 text-white text-sm px-3 py-1 rounded-full">
                    New
                  </div>
                )}
                {product.discount && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                    -{product.discount}%
                  </div>
                )}
                {/* Quick Actions */}
                <div className="absolute -bottom-20 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 group-hover:bottom-0 transition-all">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors">
                      <FiHeart className="text-white" />
                    </button>
                    <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors">
                      <FiShoppingCart className="text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Info - reduced padding */}
              <div className="p-4">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-semibold text-base mb-1 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                
                {/* Rating - reduced margin */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <FiStar className="fill-current" />
                    <span className="text-sm font-medium dark:text-white">{product.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({product.reviews} reviews)
                  </span>
                </div>

                {/* Price and Button - adjusted spacing */}
                <div className="flex items-center justify-between">
                  <div>
                    {product.discount ? (
                      <div className="space-y-0.5">
                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                        </span>
                        <span className="block text-xs text-gray-500 dark:text-gray-400 line-through">
                          ${product.price}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        ${product.price}
                      </span>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
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