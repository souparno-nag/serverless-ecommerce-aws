const {_, mongoose} = require('../../shared/database/mongo');

const SellerSchema = new mongoose.Schema({
    seller_id : {
        type : String,
        required : true,
        unique: true,
        trim : true,
    },
    seller_name : {
        type : String,
        required : true,
        trim: true
    },
    email : {
        type : String,
        required : true,
        unique: true,
        trim : true,
        lowercase : true,
    },
    password : {
        type : String,
        required : true,
        trim: true
    }
}, {timestamps : true});

module.exports = mongoose.model('Seller', SellerSchema);   