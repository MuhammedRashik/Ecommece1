const asyncHandler = require('express-async-handler')
const User = require("../models/userModel");
const Product = require('../models/productModel.js');
const Oder= require('../models/oderModel')

const mongoose=require('mongoose')

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

      
        const productDetails = await Product.find({ _id: { $in: productIds } });

        const cartItemQuantities = user.cart.map(cartItem => ({
          ProductId: cartItem.ProductId,
          quantity: cartItem.quantity,
          price: cartItem.price, // Add the price of each product
        }));
    
        const orderProducts = productDetails.map(product => ({
          ProductId: product._id,
          price: product.price,
          quantity: cartItemQuantities.find(item => item.ProductId.toString() === product._id.toString()).quantity,
        }));


        console.log('this the produxt that user by ',orderProducts);
       
        const oder = new Oder({
            totalPrice:totalPrice,    
            createdOn: createdOn,
            date:date,
            product:orderProducts,
            userId:userId,
            payment:payment,
            address:address,
            status:'pending'

        })
         const oderDb = await oder.save()

        
    if(oderDb){
        res.json({status:true,oderId:oderDb._id ,qty:cartItemQuantities})

    }
     
        
        
        
        
        
    } catch (error) {
        console.log('Error form oder Ctrl in the function oderPlaced', error);
        
    }
})

//============================================================================
//--------------------------list the oder datas ------------------------


const allOderData = asyncHandler(async (req, res) => {
    try {
        const userId = req.session.user;
        const orders = await Oder.find({ userId: userId });

        // Create an array to store promises for populating product details
        const populatePromises = orders.map(async (order) => {
            // For each order, populate the product details in the product array
            await Oder.populate(order, { path: 'product.ProductId', select: 'title' });
        });

        // Wait for all promises to resolve
        await Promise.all(populatePromises);

        res.render('oderList', { orders });
    } catch (error) {
        console.log('Error from oderCtrl in the function allOderData', error);
        res.status(500).json({ status: false, error: 'Server error' });
    }
});
//--------------------------------------------------------------------


///------------------------the oder trsking page --------------------------
const oderTraking=asyncHandler(async(req,res)=>{
    try {
        const productId=req.query.id
        const orderId = req.query.orderId 
     
        const order=await Oder.findById(orderId)

        console.log('this the oder data >>>>>>>>>>>>>>>>> ',order.product[0].quantity);
        const userId=req.session.user;
        const user=await User.findById(userId)   

        res.render('oderTraking',{order,user})
        
    } catch (error) {
        console.log('Error form oder Ctrl in the function oderTracking', error);
        
    }
})




module.exports = { oderPage, chekOut ,oderPlaced ,allOderData,oderTraking}