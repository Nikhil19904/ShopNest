require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { connectDb, sequelize } = require('./config/db'); // ✅ destructure sequelize instance

// Routers
const authRouter = require('./routes/authRoutes');
const cartRouter = require('./routes/cartRoutes');
const ratingRouter = require('./routes/ratingRoutes');
const wishlistRouter = require('./routes/wishlistRoutes');
const productRouter = require('./routes/productRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Connect to database
(async () => {
  await connectDb();

  // ✅ Sync all Sequelize models with DB
  sequelize.sync({ alter: true })
    .then(() => console.log("✅ All models synced with MySQL"))
    .catch(err => console.error("❌ Sync failed:", err));
})();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.ORIGIN || 'http://localhost:3002',
  credentials: true
}));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/cart", cartRouter);
app.use("/api/ratings", ratingRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/products", productRouter);

// Test route
app.get('/test', (req, res) => {
  res.json({
    message: 'Backend server is running!',
    status: 'success'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    status: 'error'
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
  console.log('CORS enabled for all origins');
});
