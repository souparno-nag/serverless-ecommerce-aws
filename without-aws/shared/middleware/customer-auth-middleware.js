const jwt = require('jsonwebtoken');
const Customer = require('../../customer/models/Customer');

const customerAuthMiddleware = (req, res, next) => {
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
        const {customerId, username} = decodedTokenInfo;
        const checkCustomer = Customer.findById(customerId);
        if (!checkCustomer) {
            return res.status(403).json({
                success : false,
                message : 'Access denied. Invalid customerId or username'
            });
        }
        if (checkCustomer.username != username) {
            return res.status(403).json({
                success : false,
                message : 'Access denied. Invalid customerId or username'
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

module.exports = customerAuthMiddleware;