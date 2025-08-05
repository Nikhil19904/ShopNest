const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  rating: {
    rate: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema); 