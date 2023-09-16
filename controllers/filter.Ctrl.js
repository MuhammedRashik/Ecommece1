const asyncHandler=require('express-async-handler');
const Product = require('../models/productModel.js');






//------------serch in the header -------------------
const filterSearch=asyncHandler(async(req,res)=>{
    try {
        console.log('this is req. body',req.body);

        const product=await Product.find({
            catogary:{$regex:`${req.body.search}`,$options:'i'}
        })
        // const product=await Product.find()

        console.log('this is the produts i serched',product);



        res.render('filter')
        
    } catch (error) {
        console.log('Error happent in filter controller in filterSearch funttion',error);
    }
})

//-----------------------------------------

module.exports={filterSearch}