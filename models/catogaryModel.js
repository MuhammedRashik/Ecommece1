const mongoose = require('mongoose'); // Erase if already required





// Declare the Schema of the Mongo model
var catogarySchema = new mongoose.Schema({
    image:{
        type:String,
        required:true,
        
    },
    name:{
        type:String,
        required:true,
        
    },
    discription:{
        type:String,
        required:true,
       
    },
    verified:{
        type:Boolean,
       default:false
    },
    status:{
        type:Boolean,
        default:false
    }
    
});





//Export the model
module.exports = mongoose.model('Catogary', catogarySchema);