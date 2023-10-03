const asyncHandler = require('express-async-handler')
const Product = require('../models/productModel');
const slugify = require('slugify');
const nodemon = require('nodemon');
const User=require('../models/userModel')
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
const path= require('path')
const Catogary=require('../models/catogaryModel')










//--------------------get all products =----------------------
const getAllProducts = asyncHandler(async (req, res) => {
    try {
        
        const userId=req.session.user;
        const user=await User.findById(userId)
     
        const allProducts = await Product.find()
           

const itemsperpage = 5;
const currentpage = parseInt(req.query.page) || 1;
const startindex = (currentpage - 1) * itemsperpage;
const endindex = startindex + itemsperpage;
const totalpages = Math.ceil(allProducts.length / 5);
const currentproduct = allProducts.slice(startindex,endindex);


        res.render('product', {
            product: currentproduct,
            totalpages,
            currentpage,
            user
        });

    } catch (error) {
        console.log('Error occurred in product controller getAllProducts function', error);
    }
});

//--------------------------------------------------------------






//rendering add new prouct page--------------------
const addProduct = asyncHandler(async (req, res) => {
    try {
        const catogary=await Catogary.find()

        res.render('addProduct',{catogary})

    } catch (error) {
        console.log('Error happence in product controller addProduct function', error);
    }
})
//------------------------------------------------------


//create a new product and save to bd-------------------------
const createProduct = asyncHandler(async (req, res) => {
    try {
        const { title } = req.body;
        const products = req.body;
        const productExist = await Product.findOne({ title });




        if (!productExist) {
            const caseInsensitiveCatogaryExist = await Product.findOne({
                title: { $regex: new RegExp('^' + title + '$', 'i') }
            });


            if(caseInsensitiveCatogaryExist){
                res.redirect('/api/admin/addProduct');

            }else{
                if (products.title) {
                    products.slug = slugify(products.title);
                }
    
                const images = [];
                if (req.files && req.files.length > 0) {
                    for (let i = 0; i < req.files.length; i++) {
                        images.push(req.files[i].filename);
                    }
                }
    
                const newProduct = new Product({
                    title: products.title,
                    discription: products.discription,
                    brand: products.brand,
                    slug: products.title,
                    price: products.price,
                    color: products.color,
                    quantity: products.quantity,
                    catogary: products.catogary,
                    color:products.color,
                    size:products.size,
                    images: images,
                });
    
                const pr = await newProduct.save();
    
                res.redirect('/api/admin/product');

            }

           
        } else {
            console.log('Product already exists');
            res.redirect('/api/admin/addProduct');
        }
    } catch (error) {
        console.log('Error happened in product controller createProduct function', error);
    }
});
//----------------------------------------------------

//----rendering the a specific product edit page----------
const editProduct = asyncHandler(async (req, res) => {
    try {
        const id = req.query.id
        const catogary=await Catogary.find()
        const product = await Product.findById(id)

        if (product) {
            res.render('editProduct', { product: product,catogary })
        }



    } catch (error) {
        console.log('Error happence in product controller editProduct function', error);
    }
})
//=-------------------------------------------------------


const productEdited = asyncHandler(async (req, res) => {
    try {


        const existproduct= await Product.findOne({title:req.body.title})

        if(existproduct){




            res.redirect(`/api/admin/editProduct?id=${req.body.id}`)

        }else{

            const caseInsensitiveCatogaryExist = await Product.findOne({
                title: { $regex: new RegExp('^' + req.body.title + '$', 'i') }
            });

            if(caseInsensitiveCatogaryExist){
                res.redirect(`/api/admin/editProduct?id=${req.body.id}`)

            }else{
                const id = req.body.id;
                console.log(id);
                const img = req.files && req.files.length > 0 ? req.files[0].filename : null;
        
                if (img) {
                    const images = [];
                    if (req.files && req.files.length > 0) {
                        for (let i = 0; i < req.files.length; i++) {
                            images.push(req.files[i].filename);
                        }
                    }
                    const products = req.body;
        
        
                   
                   
        
        
                    const updatedPoduct = await Product.findByIdAndUpdate(id, {
                        title: products.title,
                        discription: products.discription,
                        brand: products.brand,
                        slug: products.title,
                        price: products.price,
                        color: products.color,
                        quantity: products.quantity,
                        catogary: products.catogary,
                        size:products.size,
                        images: images,
                    }, { new: true })
        
        
        
                } else {
                    const products = req.body;
                    const noImg = await Product.findByIdAndUpdate(id, {
                        title: products.title,
                        discription: products.discription,
                        brand: products.brand,
                        slug: products.title,
                        price: products.price,
                        quantity: products.quantity,
                        color: products.color,
                        catogary: products.catogary,
                    })
        
                }
                res.redirect('/api/admin/product')
                
            }

            }


           




       


    } catch (error) {
        console.log('Error happence in product controller productEdited function', error);
    }
})
//-----------------------------------------------------


//rendering the product page ---------------------------
const aProductPage = asyncHandler(async (req, res) => {
    try {
        const userId = req.session.user;
        const user = await User.findById(userId);
        const id = req.query.id;

        const product = await Product.findById(id)
        .populate({
            path: 'individualRatings.postedBy',
            model: 'User',
            select: 'username image isGoogle', // Include both 'username' and 'image'
        }); 


           
        const relatedPr = await Product.find({ catogary: product.catogary }).limit(4);

        if (product) {
            res.render('aProduct', { product, user, relatedPr });
        }

    } catch (error) {
        console.log('Error happened in product controller aProductPage function', error);
    }
});
//-------------------------------------------






//testing oagination--------------------------
const shop = asyncHandler(async (req, res) => {
    try {
        const userId=req.session.user;
        const user=await User.findById(userId)
//   console.log(req.query);
        const product = await Product.find()
            

        // Get the total number of products in the database

        // Calculate the total number of pages based on the total products and limit
        


        const itemsperpage = 6;
        const currentpage = parseInt(req.query.page) || 1;
        const startindex = (currentpage - 1) * itemsperpage;
        const endindex = startindex + itemsperpage;
        const totalpages = Math.ceil(product.length / 6);
        const currentproduct = product.slice(startindex,endindex);







        res.render('shop', { product:currentproduct, totalpages,currentpage,user });
    } catch (error) {
        console.log('Error happened in product controller shop function', error);
    }
});
//---------------------------------------------------------------------





//  list and unlist the product ----------------------

const unlistProduct = asyncHandler(async (req, res) => {
    try {
        const id = req.query.id;
        const unlistedProduct = await Product.findByIdAndUpdate(id, {
            status: false
        }, { new: true });


        res.redirect('/api/admin/product')
    } catch (error) {
        console.log('error happence in catogaryController unlistProduct function', error);
    }
})
//--------------------------------------------------------





//-------------------list a catogary-----------------------
const listProduct = asyncHandler(async (req, res) => {
    try {
        const id = req.query.id;
        const unlistedProduct = await Product.findByIdAndUpdate(id, {
            status: true
        }, { new: true });


        res.redirect('/api/admin/product')

    } catch (error) {
        console.log('error happence in catogaryController listProduct function', error);
    }
})





//----------------------dete a single picture -------------------



const deleteSingleImage = asyncHandler(async (req, res) => {
  try {
    console.log(req.query);
    const id = req.query.id;
    const imageToDelete = req.query.img;

    // Update the product in the database to remove the image reference
    const product = await Product.findByIdAndUpdate(id, {
      $pull: { images: imageToDelete }
    });

    // Delete the image file from the filesystem
    const imagePath = path.join('public', 'admin', 'assets', 'imgs', 'catogary', imageToDelete);
    await unlinkAsync(imagePath);

    console.log('Deleted image:', imageToDelete);

    res.redirect(`/api/admin/editProduct?id=${product._id}`);
  } catch (error) {
    console.log('Error occurred in categoryController deleteSingleImage function', error);
   
  }
});





///sending the i value back
const modal=asyncHandler(async(req,res)=>{
    try {
        const i = req.query.i
        res.json({status:true, i })
        
    } catch (error) {
    console.log('Error occurred in categoryController deleteSingleImage function', error);
        
    }
})





module.exports = {
    getAllProducts,
    addProduct,
    createProduct,
    editProduct,
    productEdited,
    aProductPage,
    shop,
    listProduct,
    unlistProduct,
    deleteSingleImage,
    modal
    
}