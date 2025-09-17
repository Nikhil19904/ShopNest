require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { connectDb, sequelize } = require('./config/db');
const authRouter = require('./routes/authRoutes');
const cartRouter = require('./routes/cartRoutes');
const ratingRouter = require('./routes/ratingRoutes');
const wishlistRouter = require('./routes/wishlistRoutes');
const productRouter = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect DB & sync models
(async () => {
  await connectDb();
  sequelize.sync({ alter: true })
    .then(() => console.log("✅ Models synced"))
    .catch(err => console.error("❌ Sync failed:", err));
})();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3002', // React frontend
  credentials: true,               // Allow cookies/auth headers
  methods: ['GET','POST','PUT','DELETE']
}));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/ratings', ratingRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/products', productRouter);

// Test route
app.get('/test', (req, res) => res.json({ message: 'Backend running!' }));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', status: 'error' });
});

app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
