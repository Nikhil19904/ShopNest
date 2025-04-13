const Rating = require('../models/rating');
const User = require('../models/user');

// Add a rating to a product
const addRating = async (req, res) => {
    try {
        const { productId, rating, review } = req.body;
        const userId = req.id;

        if (!productId || !rating) {
            return res.status(400).json({
                success: false,
                message: "Product ID and rating are required."
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5."
            });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // Check if user already rated this product
        const existingRating = await Rating.findOne({ productId, userId });
        
        if (existingRating) {
            // Update existing rating
            existingRating.rating = rating;
            if (review) existingRating.review = review;
            await existingRating.save();

            return res.status(200).json({
                success: true,
                message: "Rating updated successfully.",
                rating: existingRating
            });
        } else {
            // Create new rating
            const newRating = new Rating({
                productId,
                userId,
                rating,
                review
            });

            await newRating.save();

            return res.status(201).json({
                success: true,
                message: "Rating added successfully.",
                rating: newRating
            });
        }
    } catch (error) {
        console.error("Error adding rating:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong while adding the rating."
        });
    }
};

// Get ratings for a product
const getProductRatings = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required."
            });
        }

        // Find all ratings for this product
        const ratings = await Rating.find({ productId }).populate('userId', 'name');

        // Calculate average rating
        const totalRatings = ratings.length;
        const averageRating = totalRatings > 0 
            ? ratings.reduce((sum, item) => sum + item.rating, 0) / totalRatings 
            : 0;

        return res.status(200).json({
            success: true,
            data: {
                ratings,
                stats: {
                    count: totalRatings,
                    average: parseFloat(averageRating.toFixed(1))
                }
            }
        });
    } catch (error) {
        console.error("Error getting product ratings:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong while fetching ratings."
        });
    }
};

// Get user's rating for a product
const getUserRating = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.id;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required."
            });
        }

        // Find user's rating for this product
        const rating = await Rating.findOne({ productId, userId });

        if (!rating) {
            return res.status(404).json({
                success: false,
                message: "Rating not found."
            });
        }

        return res.status(200).json({
            success: true,
            rating
        });
    } catch (error) {
        console.error("Error getting user rating:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong while fetching the rating."
        });
    }
};

// Delete a rating
const deleteRating = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.id;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required."
            });
        }

        // Find and delete the rating
        const result = await Rating.findOneAndDelete({ productId, userId });

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Rating not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Rating deleted successfully."
        });
    } catch (error) {
        console.error("Error deleting rating:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong while deleting the rating."
        });
    }
};

module.exports = {
    addRating,
    getProductRatings,
    getUserRating,
    deleteRating
}; 