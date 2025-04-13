require('dotenv').config({ path: '../../.env' });
const mongoose = require('mongoose');
const Product = require('../models/product');
const connectDb = require('../config/db');

// Products data (copied from frontend/src/data/products.js)
const products = [
  {
    title: "Modern Smartphone",
    price: 109.95,
    description: "High-performance smartphone with cutting-edge features and sleek design.",
    category: "electronics",
    image: "/images/products/electronics/elec1.jpg",
    rating: {
      rate: 4.8,
      count: 120
    }
  },
  {
    title: "Premium Laptop",
    price: 229.99,
    description: "Premium quality laptop with advanced technology and superior performance.",
    category: "electronics",
    image: "/images/products/electronics/elec2.jpg",
    rating: {
      rate: 4.5,
      count: 85
    }
  },
  {
    title: "Men's Casual T-Shirt",
    price: 55.99,
    description: "Fashionable men's t-shirt made from high-quality materials for comfort and style.",
    category: "men's clothing",
    image: "/images/products/clothing/cloth1.jpg",
    rating: {
      rate: 4.2,
      count: 110
    }
  },
  {
    title: "Women's Elegant Dress",
    price: 69.99,
    description: "Elegant women's dress designed for both comfort and style, perfect for any occasion.",
    category: "women's clothing",
    image: "/images/products/clothing/cloth2.jpg",
    rating: {
      rate: 4.6,
      count: 145
    }
  },
  {
    title: "Mechanical Pencil Set",
    price: 12.99,
    description: "Premium mechanical pencil set for students and professionals.",
    category: "stationery",
    image: "/images/products/electronics/elec1.jpg",
    rating: {
      rate: 4.3,
      count: 75
    }
  },
  {
    title: "Office Notebook",
    price: 8.50,
    description: "High-quality lined notebook for office and school use.",
    category: "stationery",
    image: "/images/products/electronics/elec2.jpg",
    rating: {
      rate: 4.1,
      count: 62
    }
  },
  {
    title: "Organic Apples",
    price: 3.99,
    description: "Fresh organic apples sourced from local farms.",
    category: "grocery",
    image: "/images/products/clothing/cloth1.jpg",
    rating: {
      rate: 4.7,
      count: 95
    }
  },
  {
    title: "Whole Grain Bread",
    price: 4.50,
    description: "Nutritious whole grain bread made with natural ingredients.",
    category: "grocery",
    image: "/images/products/clothing/cloth2.jpg",
    rating: {
      rate: 4.4,
      count: 88
    }
  }
];

// Seed function
const seedProducts = async () => {
  try {
    // Connect to the database
    await connectDb();
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Insert new products
    await Product.insertMany(products);
    
    console.log('Database seeded successfully!');
    
    // Disconnect from the database
    await mongoose.disconnect();
    
    console.log('Database disconnected');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Run the seed function
seedProducts();