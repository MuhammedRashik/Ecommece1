const asyncHandler = require('express-async-handler')
const User = require("../models/userModel");
const Product = require('../models/productModel.js');
const Oder= require('../models/oderModel')
const mongoose=require('mongoose')
const Razorpay=require('razorpay')





var instance = new Razorpay({ key_id:process.env.RAZORPAY_KEYID, key_secret: process.env.RAZORPAY_SECRETKEY })






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
          title:product.title,
          image:product.images[0],
          quantity: cartItemQuantities.find(item => item.ProductId.toString() === product._id.toString()).quantity,
        }));

      


        // console.log('this the produxt that user by ',orderProducts);
       
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
         //-----------part that dicrese the qunatity od the cutent product --
         for (const orderedProduct of orderProducts) {
            const product = await Product.findById(orderedProduct.ProductId);
         if (product) {
                const newQuantity = product.quantity - orderedProduct.quantity;
                product.quantity = Math.max(newQuantity, 0);        
                await product.save();
            }
        }
         //-------------------------------  
         
         if(oder.payment=='cod'){
           console.log('yes iam the cod methord');
            res.json({ payment: true, method: "cod", order: oderDb ,qty:cartItemQuantities,oderId:user});

         }else if(oder.payment=='online'){
           console.log('yes iam the razorpay methord');

            const generatedOrder = await generateOrderRazorpay(oderDb._id, oderDb.totalPrice);
            res.json({ payment: false, method: "online", razorpayOrder: generatedOrder, order: oderDb ,oderId:user,qty:cartItemQuantities});
                        
         }else if(oder.payment=='wallet'){
            res.json({ payment: false, method: "wallet", });
            
         }



  
    } catch (error) {
        console.log('Error form oder Ctrl in the function oderPlaced', error);
        
    }
})
//----------------------------------------------





//------------grnerate the razorpay -----------------
const generateOrderRazorpay = (orderId, total) => {
    return new Promise((resolve, reject) => {
        const options = {
            amount: total * 100,  // amount in the smallest currency unit
            currency: "INR",
            receipt: String(orderId)
        };
        instance.orders.create(options, function (err, order) {
            if (err) {
                console.log("failed");
                console.log(err);
                reject(err);
            } else {
                console.log("Order Generated RazorPAY: " + JSON.stringify(order));
                resolve(order);
            }
        });
    })
}
//----------------------------------------------






//--------------------------list the oder datas ------------------------

const allOderData = asyncHandler(async (req, res) => {
    try {
        const userId = req.session.user;
        const orders = await Oder.find({ userId: userId }).sort({ createdOn: -1 });

        // Create an array to store promises for populating product details
        const orderstitle = await Oder.find({ userId: userId }).populate({
            path: 'product.ProductId',
            select: 'title'
        });
       

        const itemsperpage = 3;
        const currentpage = parseInt(req.query.page) || 1;
        const startindex = (currentpage - 1) * itemsperpage;
        const endindex = startindex + itemsperpage;
        const totalpages = Math.ceil(orders.length / 3);
        const currentproduct = orders.slice(startindex,endindex);
      
       
        res.render('oderList', { orders:currentproduct,totalpages,currentpage });
    } catch (error) {
        console.log('Error from oderCtrl in the function allOderData', error);
        res.status(500).json({ status: false, error: 'Server error' });
    }
});
//--------------------------------------------------------------------







///------------------------the oder trsking page --------------------------
// const oderTraking=asyncHandler(async(req,res)=>{
//     try {
//         const productId=req.query.id
//         const orderId = req.query.orderId 
     
//         const order=await Oder.findById(orderId)

       
//         const userId=req.session.user;
//         const user=await User.findById(userId)   

//         res.render('oderTraking',{order,user})
        
//     } catch (error) {
//         console.log('Error form oder Ctrl in the function oderTracking', error);
        
//     }
// })

//----------------------------------------------------






///----------------orderdetails for user side-----------------

const oderDetails=asyncHandler(async(req,res)=>{
    try {
        const orderId = req.query.orderId
        // console.log('this is oder id ',orderId);
        // const  id=req.query.id.toString()
   

       const userId = req.session.user;
       const user = await User.findById(userId);
       const order = await Oder.findById(orderId)

    //    console.log('thid id the odder',order);

       res.render('oderDtls', { order ,user });

    } catch (error) {
        console.log('errro happemce in cart ctrl in function oderDetails',error); 
        
    }
})

//----------------------------------------------------------------------------------------






///--------------------------cnasel oder----------------------
const canselOder=asyncHandler(async(req,res)=>{
    try {

        const orderId = req.query.orderId
        const order = await Oder.findByIdAndUpdate(orderId,{
            status:'canceled'
        },{new:true})
        // console.log('thid id the odder',order);

        for (const productData of order.product) {
            const productId = productData.ProductId;
            const quantity = productData.quantity;

            // Find the corresponding product in the database
            const product = await Product.findById(productId);

            if (product) {
               
                product.quantity += quantity;

              
                await product.save();
            }
        }

     res.redirect('/api/user/allOderData')


    } catch (error) {
        console.log('errro happemce in cart ctrl in function canselOrder',error); 
        
    }
})
//-----------------------------------------------------






//---------------------------get all orders to the admin--------------------

const orderListing=asyncHandler(async(req,res)=>{
    try {
        const orders= await Oder.find().sort({createdOn:-1});
        // console.log('this is orders',orders);
        const itemsperpage = 3;
        const currentpage = parseInt(req.query.page) || 1;
        const startindex = (currentpage - 1) * itemsperpage;
        const endindex = startindex + itemsperpage;
        const totalpages = Math.ceil(orders.length / 3);
        const currentproduct = orders.slice(startindex,endindex);


        res.render('oderList',{orders:currentproduct,totalpages,currentpage})
        
    } catch (error) {
        console.log('errro happemce in cart ctrl in function orderListing',error); 
        
    }
})
//----------------------------------------------------------------------






////------------------order detail foradmin------------------------
const oderDetailsAdmin=asyncHandler(async(req,res)=>{
    try {
        const orderId = req.query.orderId
        

  
       const order = await Oder.findById(orderId)
       const userId=order.userId

  
       const user=await User.findById(userId)
     ;

       res.render('aOrderDetail', { order ,user });

    } catch (error) {
        console.log('errro happemce in cart ctrl in function oderDetails',error); 
        
    }
})
//-----------------------------------------------------------------------------






//-------------------admin change the user orde status --------------------
//---------------------------------------------------------------
const changeStatusPending=asyncHandler(async(req,res)=>{
    try {
        const orderId = req.query.orderId
        const order = await Oder.findByIdAndUpdate(orderId,{
            status:'pending'
        },{new:true})

        if(order){
            res.json({status:true})
        }
       
    } catch (error) {
        console.log('errro happemce in cart ctrl in function changeStatusPending',error); 
        
    }
})
//------------------------------------------------------------------------





//---------------------------------------------------------------
const changeStatusConfirmed=asyncHandler(async(req,res)=>{
    try {
        const orderId = req.query.orderId
        const order = await Oder.findByIdAndUpdate(orderId,{
            status:'conformed'
        },{new:true})
        if(order){
            res.json({status:true})
        }
        
    } catch (error) {
        console.log('errro happemce in cart ctrl in function changeStatusConfirmed',error); 
        
    }
})
//------------------------------------------------------------------------






//---------------------------------------------------------------
const changeStatusShipped=asyncHandler(async(req,res)=>{
    try {
        const orderId = req.query.orderId
        const order = await Oder.findByIdAndUpdate(orderId,{
            status:'shipped'
        },{new:true})
        if(order){
            res.json({status:true})
        }
    } catch (error) {
        console.log('errro happemce in cart ctrl in function changeStatusShipped',error); 
        
    }
})
//------------------------------------------------------------------------






//---------------------------------------------------------------
const changeStatusDelivered=asyncHandler(async(req,res)=>{
    try {
        const orderId = req.query.orderId
        const order = await Oder.findByIdAndUpdate(orderId,{
            status:'delivered'
        },{new:true})
        if(order){
            res.json({status:true})
        }
        
    } catch (error) {
        console.log('errro happemce in cart ctrl in function changeStatusDelivered',error); 
        
    }
})
//------------------------------------------------------------------------






//---------------------------------------------------------------
const changeStatusreturned=asyncHandler(async(req,res)=>{
    try {
        const orderId = req.query.orderId
        const order = await Oder.findByIdAndUpdate(orderId,{
            status:'returned'
        },{new:true})
        if(order){
            res.json({status:true})
        }
        
    } catch (error) {
        console.log('errro happemce in cart ctrl in function changeStatusreturned',error); 
        
    }
})
//------------------------------------------------------------------------






//---------------------------------------------------------------
const changeStatusCanseled=asyncHandler(async(req,res)=>{
    try {
        const orderId = req.query.orderId
        const order = await Oder.findByIdAndUpdate(orderId,{
            status:'canceled'
        },{new:true})
        if(order){
            res.json({status:true})
        }
        
    } catch (error) {
        console.log('errro happemce in cart ctrl in function changeStatusCanseled',error); 
        
    }
})
//------------------------------------------------------------------------








//-----------------------payment razorpay------------------------
const verifyPayment=asyncHandler(async(req,res)=>{
    try {
       
        verifyOrderPayment(req.body)
        res.json({ status: true });
        
    } catch (error) {
        console.log('errro happemce in cart ctrl in function verifyPayment',error); 
        
    }
})
//----------------------------------------------





//---------------verify the payment  razorpay-------------------------------

const verifyOrderPayment = (details) => {
        console.log("DETAILS : " + JSON.stringify(details));
        return new Promise((resolve, reject) => { 
            const crypto = require('crypto');
            let hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRETKEY)
            hmac.update(details.razorpay_order_id + '|' + details.razorpay_payment_id);
            hmac = hmac.digest('hex');
            if (hmac == details.razorpay_signature) {
                console.log("Verify SUCCESS");
                resolve();
            } else {
                console.log("Verify FAILED");
                reject();
            }
        })
    };

//----------------------razorpay end------------------------




///--------------------------------------------------------------------------


   


module.exports = {
     oderPage,
     chekOut ,
     oderPlaced ,
    allOderData,
    oderDetails,
    canselOder,
    orderListing,
    oderDetailsAdmin,
    changeStatusPending,
    changeStatusConfirmed,
    changeStatusShipped,
    changeStatusDelivered,
    changeStatusreturned,
    changeStatusCanseled,
    verifyPayment


}