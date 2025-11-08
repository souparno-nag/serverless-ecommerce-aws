const {_, mongoose} = require('../../shared/database/mongo');

const OrderSchema = new mongoose.Schema({
    order_id : {
        type : String,
        required : true,
        unique: true,
        trim : true
    },
    customerId : {
        type : String,
        required : true,
        unique: true,
        trim : true,
    },
    order_date : {
        type : Date,
        default : new Date(),
    },
    items : {
        product_id : {
            type : String,
            required : true,
            unique: true,
            trim : true,
        },
        quantity : {
            type : Number,
            required : true,
            default : 1
        }
    },
    shipping_address : {
        street : {
            type : String,
            required : true,
            trim : true
        },
        city : {
            type : String,
            required : true,
            trim : true
        },
        zipcode : {
            type : Number,
            required : true,
        }
    },
    total_amount : {
        type : Number,
        required : true,
        default : 0,
    }
}, {timestamps : true});

module.exports = mongoose.model('Orders', OrderSchema);