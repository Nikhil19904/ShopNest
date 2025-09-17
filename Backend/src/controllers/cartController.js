const User = require("../models/user");
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
let razorpay;
try {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
} catch (error) {
  console.error("Failed to initialize Razorpay:", error);
}

// Add item to cart
const addToCart = async (req, res) => {
  const { id, title, description, image, price, category } = req.body;
  const userId = req.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

    const existingProduct = user.cart.find(item => item.id === id);
    if (existingProduct) return res.status(200).json({ success: false, message: "Already in cart" });

    const product = { id, title, description, image, price, category, quantity: 1 };
    user.cart.push(product);

    await user.save();
    res.status(200).json({ success: true, message: "Added to cart" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  const userId = req.id;
  const itemId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

    const productIndex = user.cart.findIndex(item => item.id === itemId);
    if (productIndex === -1) return res.status(404).json({ success: false, message: "Item not found" });

    user.cart.splice(productIndex, 1);
    await user.save();

    res.status(200).json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Increment quantity
const incrementQuantity = async (req, res) => {
  const userId = req.id;
  const itemId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

    const product = user.cart.find(item => item.id === itemId);
    if (!product) return res.status(404).json({ success: false, message: "Item not found" });

    product.quantity += 1;
    await user.save();

    res.status(200).json({ success: true, message: "Quantity increased", cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Decrement quantity
const decrementQuantity = async (req, res) => {
  const userId = req.id;
  const itemId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

    const product = user.cart.find(item => item.id === itemId);
    if (!product) return res.status(404).json({ success: false, message: "Item not found" });

    if (product.quantity > 1) {
      product.quantity -= 1;
      await user.save();
      return res.status(200).json({ success: true, message: "Quantity decreased", cart: user.cart });
    }

    res.status(400).json({ success: false, message: "Quantity cannot be less than 1" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  const userId = req.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });

    user.cart = [];
    await user.save();

    res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Checkout (Razorpay)
const checkOut = async (req, res) => {
  try {
    const { items, paymentMethod } = req.body;
    if (!items?.length) return res.status(400).json({ success: false, message: "Cart is empty" });

    const amount = items.reduce((total, item) => total + (item.price * item.quantity), 0) * 100;

    if (isNaN(amount) || amount <= 0) return res.status(400).json({ success: false, message: "Invalid order amount" });

    const options = {
      amount: Math.round(amount),
      currency: "INR",
      receipt: "order_" + Date.now(),
      notes: { payment_method: paymentMethod || "card", items_count: items.length }
    };

    if (!razorpay) throw new Error("Payment gateway not initialized");

    const order = await razorpay.orders.create(options);

    if (!order?.id) throw new Error("Failed to create Razorpay order");

    res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
      payment_method: paymentMethod || "card"
    });

  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ success: false, message: "Error processing checkout: " + error.message });
  }
};

// Verify payment
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, is_mock } = req.body;

    if (is_mock) {
      const user = await User.findById(req.id);
      if (user) {
        user.cart = [];
        await user.save();
      }
      return res.status(200).json({ success: true, message: "Mock payment successful" });
    }

    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest === razorpay_signature) {
      const user = await User.findById(req.id);
      if (user) {
        user.cart = [];
        await user.save();
      }
      return res.status(200).json({ success: true, message: "Payment verified successfully" });
    }

    res.status(400).json({ success: false, message: "Payment verification failed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  checkOut,
  verifyPayment
};
