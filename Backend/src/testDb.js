require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/product');

const testDbConnection = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully.");

    // Count products
    const productCount = await Product.countDocuments();
    console.log(`Total products in database: ${productCount}`);

    // Get a sample product if available
    if (productCount > 0) {
      const sampleProduct = await Product.findOne();
      console.log("Sample product:", sampleProduct);
    } else {
      console.log("No products found in the database.");
    }

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Database disconnected.");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

// Run the test
testDbConnection(); 