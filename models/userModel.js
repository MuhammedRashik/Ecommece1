const mongoose = require('mongoose');
const bcrypt = require('bcrypt');






const addressSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
    },
    region: {
        type: String,
        required: true,
    },
    pinCode: {
        type: Number,
        required: true,
    },
    addressLine: {
        type: String,
        required: true,
    },
    areaStreet: {
        type: String,
        required: true,
    },
    ladmark: {
        type: String,
        required: true,
    },
    townCity: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    adressType: {
        type: String,
        default:"Home"
    },
    main: {
        type: Boolean,
        default: false,
    },
});







const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: Number,
      
       
    },
    password: {
        type: String,
       
    },
    isAdmin: {
        type: String,
        default: "0",
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    address: [addressSchema],
    image:{
        type:String
    },
    isGoogle:{
      type:Boolean,
      default: false

    },
    cart:{
      type:Array,
        ProductId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"Product"
        },
        quantity:{
            type:Number,
            required:true,
        },
        total:{
            type:Number,
            required:true
        },
        subTotal:{
            type:Number,
            
        }
    },
    wishlist:{
        type:Array,
        ProductId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"Product"
        },
    },
    wallet: {
       
        type:Number,
        default:0,
        required:true
       
        
    },
    history: {
        type:Array,
        amount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default:Date.now,
            
        }
    },
   
        
   
});









userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};






module.exports = mongoose.model('User', userSchema);
