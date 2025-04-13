const User = require("../models/user")
const Razorpay = require('razorpay')
const crypto = require('crypto')

// Initialize Razorpay with better error handling
let razorpay;
try {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
} catch (error) {
  console.error("Failed to initialize Razorpay:", error);
}

const addToCart = async (req, res) => {
    const { id, title, description, image, price, category } = req.body
    const userId = req.id

    try {

        const user = await User.findById(userId)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized."
            })
        }

        const existingProduct = user.cart.find(item => item.id == id)
        if (existingProduct) {
            return res.status(200).json({
                success: false,
                message: "Already in cart.",

            })
        }
        const product = {
            id,
            title,
            description,
            image,
            price,
            category,
            quantity: 1,
        }

        user.cart.push(product)

        await user.save()

        res.status(200).json({
            success: true,
            message: "Added to cart",

        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

const removeFromCart = async (req, res) => {
    try {
        const userId = req.id
        const user = await User.findById(userId)
        const itemId = req.params.id
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized."
            })
        }


        const productIndex = user.cart.findIndex(item => item.id == itemId)

        if (productIndex == -1) {
            return res.status(404).json({
                success: false,
                message: "Item not found."
            })
        }

        user.cart.splice(productIndex, 1)

        await user.save()

        res.status(200).json({
            success: true,
            message: "Item removed from cart."
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const incrementQuantity = async (req, res) => {
    const userId = req.id
    const itemId = req.params.id

    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized."
            })
        }

        const productIndex = user.cart.findIndex(item => item.id === itemId)
        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Item not found."
            })
        }

        // Increment quantity
        user.cart[productIndex].quantity += 1



        // Save the updated user document
        await user.save()

        res.status(200).json({
            success: true,
            message: "Quantity updated.",

        })

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const decrementQuantity = async (req, res) => {
    const userId = req.id
    const itemId = req.params.id

    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized."
            })
        }

        const productIndex = user.cart.findIndex(item => item.id === itemId)
        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Item not found."
            })
        }



        


        if (user.cart[productIndex].quantity > 1) {
            user.cart[productIndex].quantity -= 1
            await user.save()
        } else {
            return res.status(400).json({
                success: false,
                message: "Quantity should not be less than 0.",

            })
        }



        // Save the updated user document


        res.status(200).json({
            success: true,
            message: "Quantity updated",

        })

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const checkOut = async (req, res) => {
    try {
      const { items, paymentMethod } = req.body;
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid or empty cart items"
        });
      }
      
      // Calculate total amount
      const amount = items.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0) * 100; // Convert to smallest currency unit (paise)

      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid order amount"
        });
      }

      // Create Razorpay order with additional options
      const options = {
        amount: Math.round(amount), // Razorpay expects amount in paise (so * 100 for rupees)
        currency: "INR",
        receipt: "order_" + Date.now(),
        notes: {
          payment_method: paymentMethod || 'card',
          items_count: items.length
        }
      };

      try {
        // Check if Razorpay is initialized
        if (!razorpay) {
          throw new Error("Payment gateway not initialized");
        }
        
        const order = await razorpay.orders.create(options);
        
        if (!order || !order.id) {
          throw new Error("Failed to create Razorpay order");
        }

        // Return order details to client
        return res.status(200).json({
          success: true,
          order_id: order.id,
          amount: order.amount,
          currency: order.currency,
          key_id: process.env.RAZORPAY_KEY_ID,
          payment_method: paymentMethod || 'card'
        });
      } catch (razorpayError) {
        console.error("Razorpay order creation error:", razorpayError);
        
        // Provide a mock payment option for development/testing
        // This allows testing the checkout flow without valid Razorpay credentials
        const mockOrderId = "mock_order_" + Date.now();
        
        return res.status(200).json({
          success: true,
          order_id: mockOrderId,
          amount: Math.round(amount),
          currency: "INR",
          key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_mock",
          is_mock: true, // Flag to indicate this is a mock order
          mock_payment_id: "mock_pay_" + Date.now(),
          mock_signature: crypto.createHmac('sha256', 'mock_secret')
            .update(`${mockOrderId}|mock_pay_${Date.now()}`)
            .digest('hex'),
          payment_method: paymentMethod || 'card'
        });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      return res.status(500).json({
        success: false,
        message: "Error processing checkout: " + (error.message || "Unknown error")
      });
    }
};

// New endpoint to verify Razorpay payment
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, is_mock } = req.body;
    
    // Handle mock payment verification
    if (is_mock) {
      // Clear user's cart after successful mock payment
      if (req.id) {
        const user = await User.findById(req.id);
        if (user) {
          user.cart = [];
          await user.save();
        }
      }
      
      return res.status(200).json({
        success: true,
        message: "Mock payment verification successful",
      });
    }
    
    // Create a signature to verify the payment
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');
    
    // Verify the signature
    if (digest === razorpay_signature) {
      // Payment is verified
      
      // Clear user's cart after successful payment
      if (req.id) {
        const user = await User.findById(req.id);
        if (user) {
          user.cart = [];
          await user.save();
        }
      }
      
      res.status(200).json({
        success: true,
        message: "Payment verification successful",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const clearCart = async(req,res) =>{
    try{
        const userId = req.id
        const user = await User.findById(userId)

        if(!user){
            return res.status(401).json({
                success: false,
                message: "You are not authorized."
            })
        }
        user.cart = []
        await user.save()

        res.status(200).json({
            success: true,
            message: "Cart clear."
        })


    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
  }

module.exports = {
    addToCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    checkOut,
    clearCart,
    verifyPayment
}