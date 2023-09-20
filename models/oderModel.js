const mongoose = require('mongoose'); // Erase if already required





// Declare the Schema of the Mongo model
var oderSchema = new mongoose.Schema({
    totalPrice:{
        required:true,
        type:Number
    },
    size:{  
        type:String 
    },
    createdOn:{
        required:true, 
        type:Date,
        default:Date.now
    },
    date:{
        required:true,
        type:String,

    },
    product:{
        required:true,
        type:Array
    },
    reason:{
        type:String,
        default:0
    },
    userId:{
        required:true,
        type:String

    },
    payment:{
        required:true,
        type:String,
    },
    status:{
        required:true,
        type:String
    },
    address:{
        type:Array,
        required:true
    }
    
});





//Export the model
module.exports = mongoose.model('Oder', oderSchema);