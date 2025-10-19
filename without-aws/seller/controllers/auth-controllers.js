const Seller = require('../models/Seller');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerSeller = async (req, res) => {
    try {
        const {seller_id, seller_name, email, password} = req.body;
        const checkExistingSeller = await Seller.findOne({$or : [{seller_id}, {email}]});
        if (checkExistingSeller) {
            return res.status(400).json({
                success : false,
                message : 'Seller already exists, either with the same seller_id or email'
            });
        }
        // hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newlyCreatedSeller = new Seller({
            seller_id,
            seller_name,
            email,
            password : hashedPassword
        });
        await newlyCreatedSeller.save();
        if (newlyCreatedSeller) {
            res.status(200).json({
                success : true,
                message : 'Seller created successfully'
            });
        } else {
            res.status(400).json({
                success : false,
                message : 'Unable to register seller. Please try again.'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'Some error occured! Please try again.'
        });
    }
};

const loginSeller = async (req, res) => {
    try {
        const {seller_id, password} = req.body;
        const seller = await Seller.findOne({seller_id});
        if (!seller) {
            return res.status(400).json({
                success : false,
                message : 'Invalid seller_id or password'
            });
        }
        // check whether password is correct
        const isPasswordMatch = await bcrypt.compare(password, seller.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success : false,
                message : 'Invalid seller_id or password'
            });
        }
        // create token
        const accessToken = jwt.sign({
            id : seller._id,
            seller_id : seller.seller_id
        }, process.env.JWT_SECRET_KEY, {
            expiresIn : '30m'
        });
        res.status(200).json({
            success : true,
            message : 'Logged in succesfully!',
            accessToken
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'Some error occured! Please try again.'
        });
    }
}

module.exports = {registerSeller, loginSeller};