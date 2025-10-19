const Customer = require("../models/Customer");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerCustomer = async (req, res) => {
    try {
        const {username, name, email, password} = req.body;
        // check if the customer already exists in the database
        const checkExistingCustomer = await Customer.findOne({$or : [{username}, {email}]});
        if (checkExistingCustomer) {
            return res.status(400).json({
                success : false,
                message : 'Customer already exists... either with the same username or same email. Please try with a different username or email.',
            });
        }
        // hash the user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // add new customer to the database
        const newlyCreatedCustomer = new Customer({
            username,
            name,
            email,
            password : hashedPassword
        });
        await newlyCreatedCustomer.save();
        if (newlyCreatedCustomer) {
            res.status(200).json({
                success : true,
                message : 'Customer created successfully'
            });
        } else {
            res.status(400).json({
                success : false,
                message : 'Unable to register customer. Please try again'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'Some error occured! Please try again',
        });
    }
};

const loginCustomer = async (req, res) => {
    try {
        const {username, password} = req.body;
        // check if the customer exists in database
        const customer = await Customer.findOne({username});
        if (!customer) {
            return res.status(400).json({
                success : false,
                message : 'Invalid username or password'
            });
        }
        // check whether the password is correct or not
        const isPasswordMatch = await bcrypt.compare(password, customer.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success : false,
                message : 'Invalid username or password'
            });
        };
        // create token
        const accessToken = jwt.sign({
            customerId : username._id,
            username : username.username 
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

module.exports = {registerCustomer, loginCustomer};