const Product = require('../models/product');

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const { search, category } = req.query;
        let query = {};

        // Add search filter if provided
        if (search) {
            query = {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            };
        }

        // Add category filter if provided
        if (category && category !== 'all') {
            query.category = category;
        }

        const products = await Product.find(query);
        
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
        const product = await Product.findById(id);

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

// Search product by barcode
const getProductByBarcode = async (req, res) => {
    try {
        const { barcode } = req.params;
        
        if (!barcode) {
            return res.status(400).json({
                success: false,
                message: 'Barcode is required'
            });
        }

        const product = await Product.findOne({ barcode: barcode });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found with this barcode'
            });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Error searching product by barcode:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching product by barcode',
            error: error.message
        });
    }
};

module.exports = {
    getAllProducts,
    getProduct,
    getProductByBarcode
}; 