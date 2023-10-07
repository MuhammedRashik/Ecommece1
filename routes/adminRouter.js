const express=require('express');
const router=express();
const errorHandler=require('../middleware/errorHandler')
//----------------------------------------------





//---------------auth middlware-------------------------------
const {
    isAdminAuth
}=require('../middleware/adminAuth')
//----------------------------------------------





//---------------------admin ctrl-------------------------
const {
    loadLogin,
    adminVerifyLogin,
    logout,
    adminDashbordPage,
    users,
    blokeUser,
    unBlokeUser
}=require('../controllers/adminCtrl')
//----------------------------------------------





//-----------------catogary ctrl-----------------------------
const {
    loadCatogary ,
    getAllCatogary ,
    addCatogary,
    deleteCatogary,
    listCatogary,
    unlistCatogary,
    editCatogary,
    updateCatogary
}=require('../controllers/catogaryCtrl')
//----------------------------------------------





//-------------------product ctrl---------------------------
const {
    getAllProducts ,
    addProduct ,
    createProduct,
    editProduct,
    productEdited ,
    aProductPage,
    listProduct,
    unlistProduct,
    deleteSingleImage
 }=require('../controllers/productCtrl')
//----------------------------------------------





//-----------------order ctrl-----------------------------
const {
    orderListing,
    oderDetailsAdmin,
    changeStatusCanseled,
    changeStatusConfirmed,
    changeStatusDelivered,
    changeStatusPending,
    changeStatusShipped,
    changeStatusreturned,
    loadsalesReport,
    salesReport
}=require('../controllers/oderCtrl')
//----------------------------------------------





//-------------banner------------
const {
    banner,
    addNewBanner,
    createBanner,
    editBanner,
    updateBanner,
    deleteBanner


}=require('../controllers/bannerCtrl')




//----sharp----image croping-----
const {
    bannerCrop
}=require('../sharp/imageCrope')
//------------------------------




//--------offerCtrl----
const{
    productOfferpage,
    updateOffer,
    catogaryOffer,
    updateCatogaryOffer
}=require('../controllers/offerCtrl')


//------coupon-------------
const {
    loadCoupon,
    addCoupon,
    coupon,
    editCoupon,
    deleteCoupon,
    updateCoupon
}=require('../controllers/couponCtrl')
//-----------------------


//---blog----
const{
    adminBlog,
    loadCreateBlog,
   createBlog,
   deleteBlog,
   loadEditBlog,
    updateBlog

}=require('../controllers/blogCtrl')




//------engine set up------------
router.set('view engine','ejs'); 
router.set('views','./views/admin');
//-------------------------------





//----------multer setting---------------
const {
    upload
}=require('../multer/multer')
//----------------------------------------






//===-------------------admin---------------------------  
router.get('/',isAdminAuth,adminDashbordPage)
router.get('/login',loadLogin)//rendering the login page
router.post('/login',adminVerifyLogin)//login verifivation 
router.get('/logout',logout)///aadmin logout 
router.get('/users',users)//rendering users page 
router.get('/block',blokeUser)//admin bloking a user 
router.get('/unblock',unBlokeUser)//admin unbloking a user 
//--------------------------------------------------






//------------------product-------------------------------
router.get('/product',isAdminAuth,getAllProducts)//load all data and rendering the product page
router.get('/product/:page',isAdminAuth, getAllProducts);
router.get('/addProduct',isAdminAuth,addProduct)//rendering the addproduct page
router.post('/createProduct',isAdminAuth,upload.array('images', 12),createProduct)//creating a new product 
router.get('/editProduct',isAdminAuth,editProduct)//rendering a spesific proct edit page
router.post('/productEdited',isAdminAuth,upload.array('images', 12),productEdited)//after editing update thta data to db
router.get('/unlistProduct',isAdminAuth,unlistProduct)// unlisting tht prduct
router.get('/listProduct',isAdminAuth,listProduct)// listing tht product
router.get('/deleteSingleImage',deleteSingleImage)
//--------------------------------------------------------
 





//-------------catogary-----------------------------------
router.get('/catogary',isAdminAuth,getAllCatogary)//rendering catogary page
router.post('/addCatogary',isAdminAuth,upload.single('image'),addCatogary)//ading a new catogory to the data bsae and show it
router.get('/deleteCatogary',isAdminAuth,deleteCatogary)
router.get('/editCatogary',isAdminAuth,editCatogary)//rendering the edit catogary page with that specific user data
router.get('/unlistCatogary',isAdminAuth,unlistCatogary)//when catogary listed ulist that
router.get('/listCatogary',isAdminAuth,listCatogary)//when catogary is unlistedlist that
router.post('/updateCatogary',isAdminAuth,upload.single('image'),updateCatogary)//after rendering the edit catogary page update the catogory data to db
//-------------------------------------------------------              
 





//---------offer-------
router.get('/productOfferpage',isAdminAuth,productOfferpage)
router.post('/updateOffer',isAdminAuth,updateOffer)
router.get('/catogaryOffer',isAdminAuth,catogaryOffer)
router.post('/updateCatogaryOffer',isAdminAuth,updateCatogaryOffer)

//---------------------------------------------------------







//----------------------order-----------------------------
router.get('/orderListing',isAdminAuth,orderListing)//show all the orders to the admin page
router.get('/oderDetailsadmin',isAdminAuth,oderDetailsAdmin)//serching the and filtering dt
router.get('/changeStatusPending',isAdminAuth,changeStatusPending)
router.get('/changeStatusConfirmed',isAdminAuth,changeStatusConfirmed)
router.get('/changeStatusShipped',isAdminAuth,changeStatusShipped)
router.get('/changeStatusDelivered',isAdminAuth,changeStatusDelivered)
router.get('/changeStatusreturned',isAdminAuth,changeStatusreturned)
router.get('/changeStatusCanseled',isAdminAuth,changeStatusCanseled)
//------------------------------------------------------------







//--------------------------banner-----------------------------------
router.get('/banner',isAdminAuth,banner)
router.get('/addNewBanner',isAdminAuth,addNewBanner)
router.post('/createBanner',isAdminAuth,upload.single('image'),bannerCrop,createBanner)
router.get('/editBanner',isAdminAuth,editBanner)
router.post('/updateBanner',isAdminAuth,upload.single('image'),bannerCrop,updateBanner)
router.get("/deleteBanner",isAdminAuth,deleteBanner)
//-------------------------------------------------------







//-----------blog---
router.get('/blog',isAdminAuth,adminBlog)
router.get('/loadCreateBlog',isAdminAuth,loadCreateBlog)
router.post('/createBlog',isAdminAuth,upload.single('image'),createBlog)
router.get('/loadEditBlog',isAdminAuth,loadEditBlog)
router.post('/updateBlog',isAdminAuth,upload.single('image'),updateBlog)
router.get('/deleteBlog',isAdminAuth,deleteBlog)
//---------------------------------------------------------







//-----------coupen-------------------------
router.get('/addCoupon',isAdminAuth,loadCoupon)
router.post('/addCoupon',isAdminAuth,addCoupon)
router.get('/coupon',isAdminAuth,coupon)
router.get('/deleteCoupon',isAdminAuth,deleteCoupon)
router.post('/updateCoupon',isAdminAuth,updateCoupon)
router.get('/editCoupon',isAdminAuth,editCoupon)
//------------------------------------------







//-----------salesReport--------------
router.get('/loadsalesReport',isAdminAuth,loadsalesReport)
router.get('/salesReport',isAdminAuth,salesReport)
//---------------------------------------------------------





//----------error handler-----------------------------------------------
router.use(errorHandler)
//---------------------------------------------------------



module.exports=router