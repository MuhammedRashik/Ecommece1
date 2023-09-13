const asyncHandler = require('express-async-handler')
const User = require("../models/userModel");
const Product = require('../models/productModel.js');




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
        console.log('Error form oder Ctrl in the function sltPayment', error);
    }
})
//---------------------------------------------------------------

module.exports = { oderPage, chekOut }