const mongoose = require('mongoose'); 
const { bool } = require('sharp');




const productSchema = new mongoose.Schema({
   
    title:{
        type:String,
        required:true,
       trim:true
      
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    discription:{
        type:String,
        required:true,
       
    },
    brand:{
        type:String,
       required:true
    },
    price:{
        type:Number,
        required:true,
    },
    catogary:{
        type:String,
       required:true,
    },
    quantity:{
        type:Number,     
        default:0
    },
    sold:{
        type:Number,
        default:0,
        select:false
    },
    size:{
        type:String,
        default:"M"       
    },
   
    images:{
        type:Array,
    },
    color:{
        type:String,
       required:true
    },
    rating: {
        type:Array,
        average: Number, 
        totalRatings: Number,
        individualRatings: {
            type:Array,
                star: Number, 
                review: String,
                postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
            },
        
        default: {
            average: 0,
            totalRatings: 0,
            individualRatings: [],
        },
    },
    status:{
        type:Boolean,
        default:true
    },
   
    
},{timestamps:true});




//Export the model
module.exports = mongoose.model('Product', productSchema);