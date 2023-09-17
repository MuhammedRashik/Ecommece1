const asyncHandler=require('express-async-handler');
const Product = require('../models/productModel.js');






//------------serch in the header -------------------
const filterSearch=asyncHandler(async(req,res)=>{
    try {
        console.log('this is req. body',req.body);

        const product=await Product.find({
            catogary:{$regex:`${req.body.search}`,$options:'i'}
        })
        const itemsperpage = 6;
        const currentpage = parseInt(req.query.page) || 1;
        const startindex = (currentpage - 1) * itemsperpage;
        const endindex = startindex + itemsperpage;
        const totalpages = Math.ceil(product.length / 6);
        const currentproduct = product.slice(startindex,endindex);

        

        res.render('filter',{product:currentproduct, totalpages,currentpage,})
        
    } catch (error) {
        console.log('Error happent in filter controller in filterSearch funttion',error);
    }
})

//-----------------------------------------

module.exports={filterSearch}