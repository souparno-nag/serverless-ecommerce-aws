const Order = require('../model/Order');

const getCustomerOrders = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    try {
        const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const {customerId, _} = decodedTokenInfo;
        const allOrders = await Order.find({customerId});
        if (allOrders?.length > 0) {
            res.status(200).json({
                success: true,
                message: 'List of all orders',
                data: allOrders
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No orders in the database',
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again.'
        });
    }
}

const getSingleCustomerOrder = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    try {
        const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const {customerId, _} = decodedTokenInfo;
        const order_id = req.param.orderId;
        const singleOrderDetails = Order.findOne({customerId, order_id});
        if (!singleOrderDetails) {
            return res.status(404).json({
                success: false,
                message: 'Order with the current order_id or customerId is not available. Please try again.'
            });
        }
        res.status(200).json({
            success: true,
            data: singleOrderDetails
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again.'
        });
    }
}

const placeCustomerOrder = async (req, res) => {
    try {
        const newOrder = req.body;
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again.'
        });
    }
}

module.exports = {getCustomerOrders, getSingleCustomerOrder};