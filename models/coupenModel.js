const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var couponSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
       
    },
    discription:{
        type:String,
        required:true,
       
    },
    offerPrice:{
        type:Number,
        required:true,
    },
    minimumAmount:{
        type:Number,
    },
    createdOn:{
        type:Date,
        default:Date.now

    },
    expiryDate:{
        type:Date,
        required:true
       
    },
});

//Export the model
module.exports = mongoose.model('Coupon', couponSchema);