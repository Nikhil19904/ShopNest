import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaTruck, FaShieldAlt, FaHeadset, FaStar, FaTag } from 'react-icons/fa';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ProductCard from '../components/ProductCard';
import LiveChatWidget from '../components/LiveChatWidget';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Animated Section Component
const AnimatedSection = ({ children, className }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.section
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      className={className}
    >
      {children}
    </motion.section>
  );
};

// Featured Products Component
const FeaturedProducts = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Sample featured products data
  const featuredProducts = [
    {
      id: '1',
      title: 'Premium Wireless Headphones',
      price: 199.99,
      image: '/images/products/electronics/elec1.jpg',
      rating: { rate: 4.5 },
      description: 'High-quality wireless headphones with noise cancellation'
    },
    {
      id: '2',
      title: 'Smart Fitness Watch',
      price: 149.99,
      image: '/images/products/electronics/elec2.jpg',
      rating: { rate: 4.8 },
      description: 'Track your fitness goals with this advanced smart watch'
    },
    {
      id: '3',
      title: 'Designer Sunglasses',
      price: 89.99,
      image: '/images/products/clothing/cloth1.jpg',
      rating: { rate: 4.2 },
      description: 'Stylish designer sunglasses for both men and women'
    },
    {
      id: '4',
      title: 'Leather Backpack',
      price: 79.99,
      image: '/images/products/clothing/cloth2.jpg',
      rating: { rate: 4.6 },
      description: 'Durable and stylish leather backpack for everyday use'
    }
  ];

  return (
    <motion.div 
      ref={ref}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      {featuredProducts.map((product, index) => (
        <motion.div
          key={product.id}
          variants={itemVariants}
          custom={index}
          className="transform hover:scale-105 transition-transform duration-300"
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
};

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with enhanced animations */}
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          {/* Animated background shapes */}
          <motion.div 
            className="absolute top-0 left-0 w-96 h-96 bg-[#e2ddff] dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-xl opacity-70"
            animate={{ 
              x: [0, 30, 0],
              y: [0, 40, 0],
            }}
            transition={{ 
              repeat: Infinity,
              duration: 20,
              ease: "easeInOut"
            }}
          ></motion.div>
          <motion.div 
            className="absolute top-0 right-0 w-96 h-96 bg-[#ffd4e3] dark:bg-indigo-900 rounded-full mix-blend-multiply filter blur-xl opacity-70"
            animate={{ 
              x: [0, -30, 0],
              y: [0, 30, 0],
            }}
            transition={{ 
              repeat: Infinity,
              duration: 18,
              ease: "easeInOut"
            }}
          ></motion.div>
          <motion.div 
            className="absolute -bottom-8 left-20 w-96 h-96 bg-[#d4eaff] dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-xl opacity-70"
            animate={{ 
              x: [0, 40, 0],
              y: [0, -20, 0],
            }}
            transition={{ 
              repeat: Infinity,
              duration: 22,
              ease: "easeInOut"
            }}
          ></motion.div>
          
          {/* Modern grid pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMXYxaC0xeiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMSIvPjwvZz48L3N2Zz4=')] opacity-10"></div>
        </div>

        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.span 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-block bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-indigo-600 dark:text-indigo-400 px-5 py-2 rounded-full text-sm font-medium mb-6 shadow-sm"
            >
              Welcome to our shop
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            >
              Find Amazing Products at Incredible Prices
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto"
            >
              Discover a world of quality products curated just for you. Shop with confidence and enjoy a seamless shopping experience.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/products"
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg hover:shadow-xl text-white font-medium flex items-center justify-center group"
              >
                Shop Now
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <FaArrowRight className="ml-2" />
                  </motion.div>
              </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
              <Link
                to="/register"
                className="px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
              >
                Create Account
              </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Categories Section */}
      <AnimatedSection className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Shop by Category</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Explore our wide range of product categories</p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {['Electronics', 'Fashion', 'Home & Living', 'Beauty'].map((category, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants} 
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                }}
              >
                <Link 
                  to={`/products?category=${category.toLowerCase()}`}
                  className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 block h-full"
              >
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                    <motion.div 
                      className="text-center p-4"
                      whileHover={{ y: -5 }}
                    >
                      <motion.div 
                        className="w-16 h-16 mx-auto mb-3 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-inner"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <FaTag className="text-indigo-600 text-2xl" />
                      </motion.div>
                      <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{category}</h3>
                    </motion.div>
                </div>
              </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Products Section */}
      <AnimatedSection className="py-16 bg-gray-100 dark:bg-gray-700">
        <div className="container mx-auto px-4">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Featured Products</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Discover our handpicked selection of premium products</p>
          </motion.div>
          
          <FeaturedProducts />
        </div>
      </AnimatedSection>

      {/* Features Section */}
      <AnimatedSection className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Why Choose Us</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">We offer the best shopping experience with quality service</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <FaTruck />,
                title: "Fast Delivery",
                description: "Get your products delivered quickly and safely to your doorstep."
              },
              {
                icon: <FaShieldAlt />,
                title: "Secure Payment",
                description: "Shop with confidence using our secure payment system."
              },
              {
                icon: <FaHeadset />,
                title: "24/7 Support",
                description: "Our support team is always here to help you with any queries."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                }}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <motion.div 
                  className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-6"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-indigo-600 dark:text-indigo-400 text-2xl">
                    {feature.icon}
              </div>
                </motion.div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Testimonials Section */}
      <AnimatedSection className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">What Our Customers Say</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Read testimonials from our satisfied customers</p>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                name: "Sarah Johnson",
                role: "Fashion Enthusiast",
                text: "I love shopping here! The quality of products is amazing and the delivery is always on time."
              },
              {
                name: "Michael Chen",
                role: "Tech Lover",
                text: "The best place to find the latest gadgets. Competitive prices and excellent customer service."
              },
              {
                name: "Emily Rodriguez",
                role: "Home Decorator",
                text: "Found beautiful home decor items that perfectly match my style. Will definitely shop again!"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
              >
                <motion.div 
                  className="flex text-yellow-400 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.div
                      key={star}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaStar className="text-yellow-400" />
                    </motion.div>
                  ))}
                </motion.div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMXYxaC0xeiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMSIvPjwvZz48L3N2Zz4=')] opacity-10"
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 20
          }}
        ></motion.div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            variants={containerVariants} 
            className="max-w-3xl mx-auto text-center"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-4xl font-bold text-white mb-6"
            >
            Ready to Start Shopping?
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-lg text-white/90 mb-8"
            >
              Join thousands of satisfied customers today and discover the perfect products for you.
            </motion.p>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                to="/products"
                className="px-8 py-4 bg-white text-indigo-600 rounded-lg shadow-lg hover:shadow-xl font-medium"
              >
                Explore Products
            </Link>
            </motion.div>
          </motion.div>
        </div>
      </AnimatedSection>
      
      {/* Live Chat Widget */}
      <LiveChatWidget />
    </div>
  );
};

export default Home;