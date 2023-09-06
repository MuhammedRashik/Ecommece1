const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
    items:{
        type:{
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref:"Product"

            },
            quantity:{
                type:Number,
                default:0
            },
            total:{
                type:Number,
                default:0
            }

        },
        required:true,
        
       
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    subTotal:{
        type:Number,
        default:0
    }
    
});

//Export the model
module.exports = mongoose.model('Cart', cartSchema);