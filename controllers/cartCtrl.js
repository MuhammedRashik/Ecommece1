const asyncHandler=require('express-async-handler')
const User=require('../models/userModel')
const Product=require('../models/productModel')
const Cart=require('../models/cartModel')
//-------renderin the cart page --------------------
const loadCart=asyncHandler(async(req,res)=>{
    try {
       res.render('cart')        
    } catch (error) {
        console.log('Error Happence in cart controller loadCart function ',error);
    }
})
//----------------------------------------------




//-------------add a product to a cart -----------------------
 const addToCart=asyncHandler(async(req,res)=>{
    try {
        const id = req.query.id
       
        const user=req.session.user;
        
        const product = await Product.findById(id)
        const findUser= await User.findById(user)

        console.log('user is :',findUser);
        console.log('pruduct  is :',product);

        const newCart= new Cart({
           items:{
            productId:product._id,       
            quantity:product.quantity,
            total,
           }

        })



     


    } catch (error) {
        console.log('Error Happence in cart controller addToCart function ',error);
        
    }
 })

module.exports={loadCart,addToCart}