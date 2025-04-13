require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/product');

const sampleProducts = [
  {
    title: "Men's Casual Premium Slim Fit T-Shirts",
    price: 22.99,
    description: "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. The Henley style round neckline includes a three-button placket.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
    rating: {
      rate: 4.1,
      count: 259
    }
  },
  {
    title: "Fjallraven - Foldsack No. 1 Backpack",
    price: 109.95,
    description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    rating: {
      rate: 3.9,
      count: 120
    }
  },
  {
    title: "Women's 3-in-1 Snowboard Jacket",
    price: 56.99,
    description: "Note: The Jackets is US standard size, Please choose size as your usual wear. Material: 100% Polyester; Detachable Liner Fabric: Warm Fleece. Detachable Functional Liner: Skin Friendly, Lightweight and Warm.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
    rating: {
      rate: 2.6,
      count: 235
    }
  },
  {
    title: "MBJ Women's Solid Short Sleeve Boat Neck V",
    price: 9.85,
    description: "95% RAYON 5% SPANDEX, Made in USA or Imported, Do Not Bleach, Lightweight fabric with great stretch for comfort, Ribbed on sleeves and neckline / Double stitching on bottom hem",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg",
    rating: {
      rate: 4.7,
      count: 130
    }
  },
  {
    title: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
    price: 695.00,
    description: "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear facing inward to be bestowed with love and abundance, or outward for protection.",
    category: "jewelry",
    image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
    rating: {
      rate: 4.6,
      count: 400
    }
  },
  {
    title: "SanDisk SSD PLUS 1TB Internal SSD",
    price: 109.00,
    description: "Easy upgrade for faster boot up, shutdown, application load and response. Boosts burst write performance, making it ideal for typical PC workloads.",
    category: "electronics",
    image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg",
    rating: {
      rate: 2.9,
      count: 470
    }
  },
  {
    title: "WD 2TB Elements Portable External Hard Drive",
    price: 64.00,
    description: "USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7",
    category: "electronics",
    image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
    rating: {
      rate: 3.3,
      count: 203
    }
  },
  {
    title: "Acer SB220Q bi 21.5 inches Full HD",
    price: 599.00,
    description: "21.5 inches Full HD (1920 x 1080) widescreen IPS display. Radeon free sync technology. No compatibility for VESA Mount. Refresh rate: 75 Hz",
    category: "electronics",
    image: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg",
    rating: {
      rate: 2.9,
      count: 250
    }
  },
  {
    title: "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor",
    price: 999.99,
    description: "49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR with dual 27 inch screen side by side QUANTUM DOT (QLED) TECHNOLOGY",
    category: "electronics",
    image: "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg",
    rating: {
      rate: 2.2,
      count: 140
    }
  },
  {
    title: "BIYLACLESEN Women's 3-in-1 Snowboard Jacket",
    price: 56.99,
    description: "Note: The Jackets is US standard size, Please choose size as your usual wear. Material: 100% Polyester; Detachable Liner Fabric: Warm Fleece.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
    rating: {
      rate: 2.6,
      count: 235
    }
  }
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully for seeding.");

    // Delete existing products
    await Product.deleteMany({});
    console.log("Deleted existing products.");

    // Insert new sample products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`Successfully inserted ${createdProducts.length} products.`);

    // Log inserted products
    console.log("Products inserted:");
    createdProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title}`);
    });

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Database disconnected.");
    
    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

// Run the seeding function
seedProducts(); 