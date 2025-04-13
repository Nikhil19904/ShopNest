require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const Product = require('./models/product');

const testProductsApi = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully.");

    // Count products directly from the database
    const productCount = await Product.countDocuments();
    console.log(`Total products in database: ${productCount}`);

    // Get all products directly from the database
    const products = await Product.find({}).limit(2);
    console.log("Sample products from database:");
    console.log(products);

    // Try to access the API
    try {
      console.log("\nTrying to access API at http://localhost:3000/api/products");
      const response = await axios.get('http://localhost:3000/api/products');
      console.log("API Response Status:", response.status);
      console.log("API Response Data:", response.data);
    } catch (apiError) {
      console.error("API Error:", apiError.message);
      if (apiError.response) {
        console.error("API Error Status:", apiError.response.status);
        console.error("API Error Data:", apiError.response.data);
      }
    }

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Database disconnected.");
  } catch (error) {
    console.error("Error:", error.message);
  }
};

// Run the test
testProductsApi(); 