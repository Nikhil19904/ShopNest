const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create compound index to ensure one rating per user per product
ratingSchema.index({ productId: 1, userId: 1 }, { unique: true });

const Rating = mongoose.model('rating', ratingSchema);

module.exports = Rating; 