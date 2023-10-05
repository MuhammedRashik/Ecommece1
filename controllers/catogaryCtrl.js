const asyncHandler = require('express-async-handler');
const Catogary = require('../models/catogaryModel')
const sharp = require('sharp')
const Product=require('../models/productModel')





//--------------rendering the catogary page-------------
const loadCatogary = asyncHandler(async (req, res) => {
    try {
        res.render('catogary')

    } catch (error) {
        console.log('error happence in catogaryController loadCatogary function', error);
    }
})
//----------------------------------------------------






//adttCatogary to data base-----------------------------
const addCatogary = asyncHandler(async (req, res) => {
    try {
        const { name, discription } = req.body;

        if (!discription) {
            return res.status(400).send('Description is required');
        }

        // Convert name to lowercase
        const catogaryExist = await Catogary.findOne( {name} );

        if (catogaryExist) {
            res.redirect('/api/admin/catogary');
            
        }else{
            const caseInsensitiveCatogaryExist = await Catogary.findOne({
                name: { $regex: new RegExp('^' + name + '$', 'i') }
            });
    
            if (caseInsensitiveCatogaryExist) {
                
                res.redirect('/api/admin/catogary');
            }
    
            const newCatogary = new Catogary({
                name: name, 
                discription,
                image: req.file.filename
            });
    
            await newCatogary.save();
    
            console.log('newCatogary:', newCatogary);
            res.redirect('/api/admin/catogary');

        }

     
       
    } catch (error) {
        console.log('Error happened in catogaryController addCatogary function', error);
        res.status(500).send('Error saving category');
    }
});


//-------------------------------------------------------------







//get all catogaries in database----------------
const getAllCatogary = asyncHandler(async (req, res) => {
    try {
        const getAllCatogary = await Catogary.find();
        req.session.Catogary = getAllCatogary;
        const itemsperpage = 3;
        const currentpage = parseInt(req.query.page) || 1;
        const startindex = (currentpage - 1) * itemsperpage;
        const endindex = startindex + itemsperpage;
        const totalpages = Math.ceil(getAllCatogary.length / 3);
        const currentproduct = getAllCatogary.slice(startindex,endindex);



        res.render('catogary', { catogary: currentproduct,totalpages,currentpage, })

    } catch (error) {
        console.log('error happence in catogaryController getAllCatogary function', error);
    }
})






// soft delete a catogary-------------------------
const deleteCatogary = asyncHandler(async (req, res) => {
    try {
        const id = req.query.id;
        const catogary = await Catogary.findById(id);

        console.log('this is catogaruy', catogary,">>>>>>>>>>>>>>>",catogary.name );

        const products = await Product.find({ catogary: catogary.name });
        console.log('this is products 0', products);

        const deletedProducts = await Product.deleteMany({ catogary: catogary.name });
        console.log('Deleted products:', deletedProducts);

        const deletedCatogary = await Catogary.findByIdAndDelete(id);
        console.log('Deleted catogary:', deletedCatogary);

        res.redirect('/api/admin/catogary');
    } catch (error) {
        console.log('Error happened in catogaryController deleteCatogary function', error);
        res.status(500).send('Error deleting category and associated products');
    }
});

//--------------------------------------------------------------









//-----------------edit a catogary--------------------
const editCatogary = asyncHandler(async (req, res) => {
    try {
        const id = req.query.id;

        const user = await Catogary.findById(id)
       
        if (user) {
            res.render('editCatogary', { user: user })
        } else {
            res.redirect('/api/admin/catogary')

        }



    } catch (error) {
        console.log('error happence in catogaryController editCatogary function', error);
    }
})

//--------------------------------------------------------------








//edit the catogary updating ------------------------------------------
const updateCatogary = asyncHandler(async (req, res) => {
    try {
        const id = req.body.id;
        const img = req.file ? req.file.filename : null; // Check if req.file is defined
        if (img) {
            await Catogary.findByIdAndUpdate(id, {
                name: req.body.name,
                discription: req.body.discription, // Use the description from the request body
                image: req.file.filename
            }, { new: true })
       } else {
            await Catogary.findByIdAndUpdate(id, {
                name: req.body.name,
                discription: req.body.discription,

            }, { new: true })
        }
        res.redirect('/api/admin/catogary')
    } catch (error) {
        console.log('error happence in catogaryController editCatogary function', error);
    }
})
//-----------------------------------------------------------







//-------------------ulist a catogary--------------------------
const unlistCatogary = asyncHandler(async (req, res) => {
    try {
        const id = req.query.id;
        const unlistedUser = await Catogary.findByIdAndUpdate(id,{
            status:false
        },{new:true});

       
        res.redirect('/api/admin/catogary')
    } catch (error) {
        console.log('error happence in catogaryController unlistCatogary function', error);
    }
})
//-------------------------------------------------------------








//-------------------list a catogary-----------------------
const listCatogary = asyncHandler(async (req, res) => {
    try {
        const id = req.query.id;
        const unlistedUser = await Catogary.findByIdAndUpdate(id,{
            status:true
        },{new:true});

       
        res.redirect('/api/admin/catogary')

    } catch (error) {
        console.log('error happence in catogaryController listCatogary function', error);
    }
})

//--------------------------------------------------------









module.exports = { 
    loadCatogary, 
    getAllCatogary, 
    addCatogary, 
    deleteCatogary, 
    editCatogary, 
    unlistCatogary, 
    listCatogary, 
    updateCatogary
 }




