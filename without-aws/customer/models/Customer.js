const {_, mongoose} = require('../../shared/database/mongo');

const CustomerSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique: true,
        trim : true,
    },
    name : {
        type : String,
        required : true,
        trim: true
    },
    dob : {
        type : Date,
        required : false
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
    }
}, {timestamps : true});

module.exports = mongoose.model('Customer', CustomerSchema);