const asyncHandler = require('express-async-handler')
const User = require("../models/userModel");
const Product = require('../models/productModel.js');
const Oder= require('../models/oderModel')



//-------------------load oder page----------------------


const oderPage = asyncHandler(async (req, res) => {
    try {
        res.render('oderPage')

    } catch (error) {
        console.log('Error form oder Ctrl in the function oderPage', error);
    }
})




// -----------------------------------------------------------


//--------------------------payment selvtion page--------------------------
const chekOut = asyncHandler(async (req, res) => {
    try {
        const id = req.session.user
        const user = await User.findById(id)
        //   console.log(user.cart);
        const productIds = user.cart.map(cartItem => cartItem.ProductId);
        const product = await Product.find({ _id: { $in: productIds } });

        let sum = 0;
        for (let i = 0; i < user.cart.length; i++) {
            sum += user.cart[i].subTotal
        }
        res.render('chekOut', { user, product, sum })

    } catch (error) {
        console.log('Error form oder Ctrl in the function chekOut', error);
    }
})
//---------------------------------------------------------------





//-----------------------oderplaced-----------------------------
const oderPlaced=asyncHandler(async(req,res)=>{
    try {
        // console.log(req.body);
        const {totalPrice,createdOn,date,payment,addressId}=req.body
        // console.log(addressId);
        const userId=req.session.user
        const user= await User.findById(userId);
        const productIds = user.cart.map(cartItem => cartItem.ProductId);
        // console.log('product is +>>>>>>>>>>>>>>>>>>>>>>>>>',user.address);

        const address = user.address.find(item => item._id.toString() === addressId);

      console.log(address);
        const product = await Product.find({ _id: { $in: productIds } });
    
        const oder = new Oder({
            totalPrice:totalPrice,    
            createdOn: createdOn,
            date:date,
            product:product,
            userId:userId,
            payment:payment,
            address:address,
            status:'pending'

        })
         const oderDb= await oder.save()

         console.log('this is new oder data>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ',oderDb);
    if(oderDb){
        res.json({status:true})

    }
     
        
        
        
        
        
    } catch (error) {
        console.log('Error form oder Ctrl in the function oderPlaced', error);
        
    }
})
module.exports = { oderPage, chekOut ,oderPlaced}