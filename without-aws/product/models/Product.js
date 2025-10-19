const {_, mongoose} = require('../../shared/database/mongo');

const ProductSchema = new mongoose.Schema({
    product_id : {
        type : String,
        required : true,
        unique: true,
        trim : true
    },
    product_name : {
        type : String,
        required : true,
        trim: true
    },
    description : {
        type : String
    },
    seller_id : {
        type : String,
        required : true,
        trim : true
    },
    price : {
        type : Number,
        required : true
    },
    category : {
        type : String,
        required : true
    },
    stock_quantity : {
        type : Number,
        required : true,
        default : 0
    }
}, {timestamps : true});

module.exports = mongoose.model('Product', ProductSchema);