const jwt = require('jsonwebtoken');
const Seller = require('../../seller/models/Seller');

const sellerAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            success : false,
            message : 'Access denied. No token provided. Please login to continue.'
        });
    }
    try {
        const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const {id, _} = decodedTokenInfo;
        const checkSeller = Seller.findById(id);
        if (!checkSeller) {
            return res.status(403).json({
                success : false,
                message : 'Access denied. Invalid id'
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : 'Access denied'
        });
    }
};

module.exports = sellerAuthMiddleware;