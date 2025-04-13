const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    try {
        // Check for token in cookies
        const cookieToken = req.cookies?.token;
        
        // Check for token in Authorization header
        const authHeader = req.headers.authorization;
        const headerToken = authHeader && authHeader.startsWith('Bearer ') 
            ? authHeader.split(' ')[1] 
            : null;
        
        // Use token from either source
        const token = headerToken || cookieToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please login."
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.id = decoded.id;
            next();
        } catch (tokenError) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token. Please login again."
            });
        }
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during authentication."
        });
    }
}

module.exports = verifyToken