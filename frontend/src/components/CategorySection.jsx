import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BiChevronRight } from 'react-icons/bi';

const categories = [
  {
    id: 1,
    name: "Electronics",
    image: "/images/categories/electronics.jpg",
    icon: "🎮",
    itemCount: 150,
    badge: "New",
    subcategories: ["Mobiles", "Laptops", "Cameras", "Accessories"]
  },
  {
    id: 2,
    name: "Fashion",
    image: "/images/categories/fashion.jpg",
    icon: "👕",
    itemCount: 200,
    badge: "Popular",
    subcategories: ["Men's Clothing", "Women's Clothing", "Shoes", "Accessories"]
  },
  {
    id: 3,
    name: "Home & Living",
    image: "/images/categories/home.jpg",
    icon: "🏠",
    itemCount: 120,
    subcategories: ["Furniture", "Decor", "Kitchen", "Bedding"]
  },
  {
    id: 4,
    name: "Sports",
    image: "/images/categories/sports.jpg",
    icon: "⚽",
    itemCount: 90,
    subcategories: ["Fitness", "Outdoor", "Indoor", "Accessories"]
  },
  {
    id: 5,
    name: "Beauty",
    image: "/images/categories/beauty.jpg",
    icon: "✨",
    itemCount: 180,
    subcategories: ["Skincare", "Makeup", "Haircare", "Fragrances"]
  },
  {
    id: 6,
    name: "Books",
    image: "/images/categories/books.jpg",
    icon: "📚",
    itemCount: 250,
    subcategories: ["Fiction", "Non-fiction", "Comics", "Academic"]
  }
];

const CategorySection = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 flex items-center justify-between"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Shop by Category
          </h2>
          <Link to="/products" className="text-blue-600 hover:underline font-medium">
            See all categories
          </Link>
        </motion.div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.03 }}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow relative"
            >
              <Link to={`/category/${category.id}`} className="block overflow-hidden rounded-xl">
                {/* Image */}
                <div className="h-36 w-full overflow-hidden rounded-t-xl relative">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                  />
                  {category.badge && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {category.badge}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{category.icon}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {category.itemCount} items
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {category.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 font-medium hover:underline">Shop Now</span>
                    <BiChevronRight className="text-gray-500 dark:text-gray-300" />
                  </div>
                </div>

                {/* Mega Dropdown */}
                {hoveredCategory === category.id && category.subcategories && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 p-4"
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {category.name} Categories
                    </h4>
                    <ul className="space-y-2">
                      {category.subcategories.map((sub, index) => (
                        <li key={index}>
                          <Link 
                            to={`/category/${category.id}/${sub.toLowerCase()}`} 
                            className="text-gray-700 dark:text-gray-200 hover:text-blue-600 block transition-colors"
                          >
                            {sub}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile scroll */}
        <div className="flex md:hidden space-x-4 overflow-x-auto scrollbar-hide py-4">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.05 }}
              className="min-w-[180px] bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow flex-shrink-0"
            >
              <Link to={`/category/${category.id}`} className="block overflow-hidden rounded-xl">
                <div className="h-32 w-full overflow-hidden rounded-t-xl">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-1">
                    {category.name}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{category.itemCount} items</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
