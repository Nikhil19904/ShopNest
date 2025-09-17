const { Op } = require('sequelize');
const Product = require('../models/product'); // Sequelize model

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const { search, category } = req.query;

        // Build where clause dynamically
        const where = {};

        // Search by title or description
        if (search) {
            where[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        // Filter by category
        if (category && category !== 'all') {
            where.category = category;
        }

        const products = await Product.findAll({ where });

        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
};

// Get single product
const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
};

module.exports = {
    getAllProducts,
    getProduct
};
