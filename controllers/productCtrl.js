const asyncHandler = require('express-async-handler')
const Product = require('../models/productModel');
const slugify = require('slugify');
const nodemon = require('nodemon');

//-----displat all proct and rendering the products------------------

const getAllProducts = asyncHandler(async (req, res) => {
    try {
        const allProducts = await Product.find();
        req.session.Products = allProducts;
        res.render('product', { product: req.session.Products })

    } catch (error) {
        console.log('Error happence in product controller getAllProducts function', error);

    }
})
//--------------------------------------------------------------------------------



//rendering add new prouct page--------------------
const addProduct = asyncHandler(async (req, res) => {
    try {

        res.render('addProduct')

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
                description: products.description,
                brand: products.brand,
                slug: products.title,
                price: products.price,
                color: products.color,
                category: products.category,
                images: images,
            });

            const pr = await newProduct.save();

            res.redirect('/api/admin/product');
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

        const product = await Product.findById(id)

        if (product) {
            res.render('editProduct', { product: product })
        }



    } catch (error) {
        console.log('Error happence in product controller editProduct function', error);
    }
})
//=-------------------------------------------------------


const productEdited = asyncHandler(async (req, res) => {
    try {
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
                catogary: products.catogary,
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
                color: products.color,
                catogary: products.catogary,
            })

        }
        res.redirect('/api/admin/product')


    } catch (error) {
        console.log('Error happence in product controller productEdited function', error);
    }
})
//-----------------------------------------------------


//rendering the product page ---------------------------
const aProductPage = asyncHandler(async (req, res) => {
    try {
        const id = req.query.id
        const product = await Product.findById(id)
        if (product) {

            res.render('aProduct', { product: product })
        }

    } catch (error) {
        console.log('Error happence in product controller aProductPage function', error);


    }
})

//-------------------------------------------

//=----------------render the shop page through index ------------------------

const shop=asyncHandler(async(req,res)=>{
    try {
        const product = await Product.find();
      
            res.render('shop',{product})
      
        
    } catch (error) {
        console.log('Error happence in product controller shop function', error);
    }
})








module.exports = { getAllProducts, addProduct, createProduct, editProduct, productEdited, aProductPage ,shop}