const express = require('express');
const router = express.Router();
const sellerAuthMiddleware = require('../../shared/middleware/seller-auth-middleware');
const customerAuthMiddleware = require('../../shared/middleware/customer-auth-middleware');
const {getAllProducts, getProductById, addProduct, deleteProduct, updateProduct} = require('../controllers/product-controllers');

router.get("/products", customerAuthMiddleware, getAllProducts);
router.get("/products/:productId", customerAuthMiddleware, getProductById);
router.post("/products", sellerAuthMiddleware, addProduct);
router.delete("/products/:productId", sellerAuthMiddleware, deleteProduct);
router.put("/products/:productId", sellerAuthMiddleware, updateProduct);

module.exports = router;