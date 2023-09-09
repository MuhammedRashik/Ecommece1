
const asyncHandler = require('express-async-handler');
const User=require('../models/userModel.js')
const Product=require('../models/productModel.js')

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
const addToCart = asyncHandler(async (req, res) => {
    try {
        const id = req.query.id;     
        const user = req.session.user;
        const product = await Product.findById(id);
        const userData = await User.findById(user);
if(userData){
                                            
    if(user.cart.length==0){
        userData.cart.push({
            ProductId: id,
            quantity: 1,
            total: product.price, // Set the total as the initial price
            subTotal: product.price,
        });

    }else{
        

    }
  
}

      
           
        res.redirect('/api/user');
    } catch (error) {
        console.log('Error occurred in cart controller addToCart function', error);
       
    }
});                                                                                                                     

module.exports={loadCart,addToCart}






