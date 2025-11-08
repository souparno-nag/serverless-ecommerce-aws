const express = require('express');
const router = express.Router();
const customerAuthMiddleware = require('../../shared/middleware/customer-auth-middleware');
const {getCustomerOrders, placeCustomerOrder, updateCustomerOrder, getSingleCustomerOrder, deleteCustomerOrder} = require('../controllers/order-controllers');

router.get("/orders", customerAuthMiddleware, getCustomerOrders);
router.post("/orders", customerAuthMiddleware, placeCustomerOrder);
router.put("/orders/:orderId", customerAuthMiddleware, updateCustomerOrder);
router.get("/orders/:orderId", customerAuthMiddleware, getSingleCustomerOrder);
router.delete("/orders/:orderId", customerAuthMiddleware, deleteCustomerOrder);

module.exports = router;