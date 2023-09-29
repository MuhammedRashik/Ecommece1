const asyncHandler=require('express-async-handler');
const Product = require('../models/productModel.js');
const Catogary=require('../models/catogaryModel.js');






//------------serch in the header based on catogary  -------------------
const filterSearch=asyncHandler(async(req,res)=>{
    try {
       

        const product=await Product.find({
            catogary:{$regex:`${req.body.search}`,$options:'i'}
        })
        
        const itemsperpage = 8;
        const currentpage = parseInt(req.query.page) || 1;
        const startindex = (currentpage - 1) * itemsperpage;
        const endindex = startindex + itemsperpage;
        const totalpages = Math.ceil(product.length / 8);
        const currentproduct = product.slice(startindex,endindex);

        

        res.render('filter',{product:currentproduct, totalpages,currentpage,})
        
    } catch (error) {
        console.log('Error happent in filter controller in filterSearch funttion',error);
    }
})
//-----------------------------------------





///-------------------------filter by size -------------------
const sizeFilter=asyncHandler(async(req,res)=>{
    try {
        const size=req.query.size; 
        const product=await Product.find({size:size})
        const itemsperpage = 8;
        const currentpage = parseInt(req.query.page) || 1;
        const startindex = (currentpage - 1) * itemsperpage;
        const endindex = startindex + itemsperpage;
        const totalpages = Math.ceil(product.length / 8);
        const currentproduct = product.slice(startindex,endindex);
        res.render('filter',{product:currentproduct, totalpages,currentpage,})       
    } catch (error) {
        console.log('Error happent in filter controller in sizefilter funttion',error);
        
    }
})
//-----------------------------------------------------------------





//-------------------------filter by coler-------------------------------
const colorFilter=asyncHandler(async(req,res)=>{
    try {
        const color=req.query.color;
        const product=await Product.find({color:color})
        const itemsperpage = 8;
        const currentpage = parseInt(req.query.page) || 1;
        const startindex = (currentpage - 1) * itemsperpage;
        const endindex = startindex + itemsperpage;
        const totalpages = Math.ceil(product.length / 8);
        const currentproduct = product.slice(startindex,endindex);
        res.render('filter',{product:currentproduct, totalpages,currentpage,})

    } catch (error) {
        console.log('Error happent in filter controller in colorfilter funttion',error);
        
    }
})
//--------------------------------------------






//-------------filter by -price ------------------

const priceFilter=asyncHandler(async(req,res)=>{  
    try {

        const price = req.query.price;
        const maxPrice = req.query.maxPrice;
        const product = await Product.find({ $and: [{ price: { $gte: price } }, { price: { $lte: maxPrice } }] });
        
        const itemsperpage = 8;
        const currentpage = parseInt(req.query.page) || 1;
        const startindex = (currentpage - 1) * itemsperpage;
        const endindex = startindex + itemsperpage;
        const totalpages = Math.ceil(product.length / 8);
        const currentproduct = product.slice(startindex,endindex);
        res.render('filter',{product:currentproduct, totalpages,currentpage,})

        
    } catch (error) {
        console.log('Error happent in filter controller in pricefilter funttion',error);
        
    }
})
//-------------------------------------------------------






//------------------filter by brand ----------------------------------
const brandFilter=asyncHandler(async(req,res)=>{
    try {
        const brand=req.query.brand;
        const product=await Product.find({brand:brand})
        const itemsperpage = 8;
        const currentpage = parseInt(req.query.page) || 1;
        const startindex = (currentpage - 1) * itemsperpage;
        const endindex = startindex + itemsperpage;
        const totalpages = Math.ceil(product.length / 8);
        const currentproduct = product.slice(startindex,endindex);
        res.render('filter',{product:currentproduct, totalpages,currentpage,})

        
    } catch (error) {
        console.log('Error happent in filter controller in brandfilter funttion',error);
        
    }
})
//--------------------------------------------------------------------






//-----------------------filter with catogary------------------

const CatogaryFilter=asyncHandler(async(req,res)=>{
    try {
        const catogary=req.query.catogary
        const product=await Product.find({catogary:catogary})
        const itemsperpage = 8;
        const currentpage = parseInt(req.query.page) || 1;
        const startindex = (currentpage - 1) * itemsperpage;
        const endindex = startindex + itemsperpage;
        const totalpages = Math.ceil(product.length / 8);
        const currentproduct = product.slice(startindex,endindex);
        res.render('filter',{product:currentproduct, totalpages,currentpage,})


    } catch (error) {
        console.log('Error happent in filter controller in CatogaryFilter funttion',error);
        
    }
})
//------------------------------------------



//--------------clear the fi;lter and show all the data-------------------
const clearFilter = asyncHandler(async(req,res)=>{
 try {
   
    const product=await Product.find()
    const itemsperpage = 8;
    const currentpage = parseInt(req.query.page) || 1;
    const startindex = (currentpage - 1) * itemsperpage;
    const endindex = startindex + itemsperpage;
    const totalpages = Math.ceil(product.length / 8);
    const currentproduct = product.slice(startindex,endindex);
    res.render('filter',{product:currentproduct, totalpages,currentpage,})

    
    
 } catch (error) {
    console.log('Error happent in filter controller in clearFilter funttion',error);
    
 }
})

//---------------------------------------------






//---------------------sort by price-------------
const sortByPrice=asyncHandler(async(req,res)=>{

 
        try {
          const sort = req.query.sort;
          console.log(sort,">>>>>>>>>");
          let sortOrder
        if(sort=="lowToHigh"){
            sortOrder= 1
        }else{
            sortOrder=-1
        }
       
          console.log(sortOrder,">>>>>>>>>");
      
          let product = await Product.find().sort({ price: sortOrder });
          console.log(sortOrder,">>>>>>>>>");

          const itemsperpage = 8;
          const currentpage = parseInt(req.query.page) || 1;
          const startindex = (currentpage - 1) * itemsperpage;
          const endindex = startindex + itemsperpage;
          const totalpages = Math.ceil(product.length / 8);
          const currentproduct = product.slice(startindex,endindex);
         
      
          res.render('filter', { product: currentproduct, totalpages, currentpage });
        } catch (error) {
          console.log('Error happened in filter controller in sortByPrice function', error);
        }
      });


//----------------------------








    




module.exports={
    filterSearch,
    sizeFilter,
    colorFilter,
    priceFilter,
    brandFilter,
    CatogaryFilter,
    clearFilter,
    sortByPrice
    
   
}