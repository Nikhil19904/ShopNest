import React from 'react';
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
    bgColor: "from-blue-500/10 to-indigo-500/10"
  },
  {
    id: 2,
    name: "Fashion",
    image: "/images/categories/fashion.jpg",
    icon: "👕",
    itemCount: 200,
    bgColor: "from-pink-500/10 to-rose-500/10"
  },
  {
    id: 3,
    name: "Home & Living",
    image: "/images/categories/home.jpg",
    icon: "🏠",
    itemCount: 120,
    bgColor: "from-amber-500/10 to-yellow-500/10"
  },
  {
    id: 4,
    name: "Sports",
    image: "/images/categories/sports.jpg",
    icon: "⚽",
    itemCount: 90,
    bgColor: "from-green-500/10 to-emerald-500/10"
  },
  {
    id: 5,
    name: "Beauty",
    image: "/images/categories/beauty.jpg",
    icon: "✨",
    itemCount: 180,
    bgColor: "from-purple-500/10 to-violet-500/10"
  },
  {
    id: 6,
    name: "Books",
    image: "/images/categories/books.jpg",
    icon: "📚",
    itemCount: 250,
    bgColor: "from-red-500/10 to-orange-500/10"
  }
];

const CategorySection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50/50 via-blue-50/30 to-indigo-50/20 dark:bg-blue-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Shop by Category
          </h2>
          <p className="text-white-600 bold:text-gray-400">
            Explore our wide range of products across various categories
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              viewport={{ once: true }}
            >
              <Link 
                to={`/category/${category.id}`}
                className="block relative overflow-hidden rounded-2xl group bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.bgColor} group-hover:scale-110 transition-transform duration-500`} />
                <div className="relative p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{category.icon}</span>
                    <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      {category.itemCount} items
                      <BiChevronRight className="ml-1" />
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {category.name}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Shop Now
                    </span>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                    >
                      <BiChevronRight className="text-gray-900 dark:text-white" />
                    </motion.div>
                  </div>
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