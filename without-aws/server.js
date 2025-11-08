require('dotenv').config();
const express = require('express');
const {connectToDB, _} = require('./shared/database/mongo');
const customerAuthRoutes = require('./customer/routes/auth-routes');
const sellerAuthRoutes = require('./seller/routes/auth-routes');
const productRoutes = require('./product/routes/product-routes');
// const orderRoutes = require('./order/routes/order-routes');

connectToDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

app.use('/cauth', customerAuthRoutes);
app.use('/sauth', sellerAuthRoutes);
app.use('/store', productRoutes);
// app.use('/store', orderRoutes);

app.listen(PORT, () => {
    console.log(`Server is listening to port ${PORT}`);
});