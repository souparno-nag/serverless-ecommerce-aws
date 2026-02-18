const Order = require('../model/Order');
const Product = require('../../product/models/Product');
const uuid = require('uuid');
const uuidv4 = uuid.v4;

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
        const newOrderRequest = req.body;
        const {customerId, items, shipping_address} = newOrderRequest;
        const order_id = uuidv4();
        const total_amount = 0;
        for (let prod of items) {
            const {product_id, quantity} = prod;
            const productDetailsById = await Product.find({product_id});
            const {price, stock_quantity} = productDetailsById;
            if (quantity > stock_quantity) {
                return res.status(422).json({
                    success: false,
                    message: 'Not enough products in stock to meet current rquirement'
                });
            }
            total_amount += quantity * price;
        }
        for (let prod of items) {
            const {product_id, quantity} = prod;
            const productDetailsById = await Product.find({product_id});
            const {stock_quantity} = productDetailsById;
            stock_quantity -= quantity;
            productDetailsById[stock_quantity] = stock_quantity;
        }
        const newOrder = {
            order_id,
            customerId,
            order_date: Date.now(),
            items,
            shipping_address,
            total_amount
        };
        const newlyCreatedOrder = await Order.create(newOrder);
        if (newlyCreatedOrder) {
            res.status(200).json({
                success: true,
                message: 'Order added successfully',
                data: newlyCreatedOrder
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

const deleteCustomerOrder = async (req, res) => {
    try {
        const order_id = req.params.orderId;
        const orderDetailsByID = await Order.find({order_id});

        const deletedOrder = await Order.findByIdAndDelete(orderDetailsByID);

        if (!deletedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order is not found with this ID",
            });
        }

        res.status(200).json({
            success: true,
            data: deletedOrder,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again.'
        });
    }
}

const updateCustomerOrder = async (req, res) => {
    try {
        const updatedOrderData = req.body;
        const order_id = req.params.orderId;
        const orderDetailsByID = await Order.find({order_id});

        const updatedOrder = await Order.findByIdAndUpdate(
            orderDetailsByID,
            updatedOrderData,
            {
                new: true,
            }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order is not found with this ID",
            });
        }

        res.status(200).json({
            success: true,
            data: updatedOrder,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again.'
        });
    }
}

module.exports = {getCustomerOrders, getSingleCustomerOrder, placeCustomerOrder, deleteCustomerOrder, updateCustomerOrder};