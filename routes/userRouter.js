const express = require('express')
const router = express();
const passport=require('passport')
const User=require('../models/userModel')
const errorHandler=require('../middleware/errorHandler')
//-------------------------------------
//-/////////////////////////////////////////-required-/////////////////////////////





//---------multer----------
const { upload } = require('../multer/multer')
//-----------------------


require('../config/passport') 



//----------user controller-----------
const { loadIndex,
    loadSignIn,
    loadSignUp,
    registerUser,
    userLogin,
    userLogout,
    mobileOTP,
    emailVerified,
    forgotPsdPage,
    forgotEmailValid,
    forgotPsdOTP,
    updatePassword,
    userProfile,
    addAddress,
    loadEditAddress,
    updateEditedAddress,
    deleteAddress,
    editProfile,
    updateProfile,
    addProficPic,
    googleAuth,
   


} = require('../controllers/userCtrl')
//-----------------------------------------------






//------------auth Midleware-------------
const { 
    isLogged

} = require('../middleware/auth')
//------------------------------------------






//-----------------productCtrl------------------
const { 
    aProductPage,
    shop ,
    modal

} = require('../controllers/productCtrl')
//----------------------------------------------






//----------------cart------------------
const { 
    loadCart,
    addToCart,
    testdic,
    testAjax,
    deleteItemeCart,
    deleteCart,
    updateCart
    

  

} = require('../controllers/cartCtrl')
//----------------------






//----------oderCtrl----------------
const {
    oderPage,
    chekOut,
    oderPlaced,
    allOderData,
    oderDetails,
    canselOder,
    verifyPayment,
    useWallet,
    returnOrder,
    buyNOw,
    buynowPlaceOrder
    
}=require('../controllers/oderCtrl')
//------------------------------------






///-----------filter ctrl-----
const {
    filterSearch,
    sizeFilter,
    colorFilter,
    priceFilter,
    brandFilter,
    CatogaryFilter,
    clearFilter,
    sortByPrice
   

}=require('../controllers/filter.Ctrl')
//-------------------------------------------






//-----------wishlistctrl----
const {
    Wishlist,
    addToList,
    deleteWishlistItem

}=require('../controllers/wishlistCtrl')

//---------------------------






//------------------invoice ctrl-----------
const {
    invoice,
    invoices

}=require('../controllers/invoiceCtrl')




//--------walte ctrl-------
const {
    addMoneyWallet,
    updateMongoWallet,
    sumWallet
   

}=require('../controllers/walletCtrl')
//--------------------------




//-----revieww--
const {
    review
}=require('../controllers/reviewCtrl')





//-------coupon--------
const {
    validateCoupon
}=require('../controllers/couponCtrl')
//-------------------------

const {google} = require('googleapis');
///////////////////////////////////////////////////--require end--/////////////////////////////





//----engine-----------
router.set('view engine', 'ejs');
router.set('views', './views/user');
//-------------------------


  
  
  
  
  
//--------------------------------google sign up ---------------------
router.get('/googlLog',passport.authenticate('google',{scope:['profile','email']}))
router.get('/google/callback',passport.authenticate('google',{failureRedirect:'/failed' }),googleAuth)
//----------------------------------------------------------------------------------




//----------------user-----------------------------------
router.get('/',loadIndex)//load the indexpage 
router.get('/login' ,loadSignIn)//load the sign in page 
router.get('/register',loadSignUp)//load the signup page 
router.post('/register', registerUser)//signup a user with data aand otp send 
router.post('/login', userLogin)// user login with data and session created
router.get('/logout',userLogout)//user logout and session delete
router.post('/emailVerified', emailVerified)//otp verification 
router.get('/forgotPassword', forgotPsdPage)//rendering the forgot passrod page 
router.post('/forgotEmailValid', forgotEmailValid)//email cheking forgot password
router.post('/forgotPsdOTP', forgotPsdOTP)//otp send and chek
router.post('/updatePassword', updatePassword)//if otp corect update the password
router.get("/mobileOTP", mobileOTP) //mobile otp verification page do it later
//---------------------------------------------------------------

     




//----------prifle--------------
router.get('/profile',isLogged ,userProfile)//renderig profile
router.get('/editProfile', isLogged,editProfile)//rendering the user profile edit page
router.post('/updateProfile', isLogged,updateProfile)//updating the user profile--
router.post('/addProficPic', isLogged,upload.single('image'), addProficPic)//user can add a profile picture 
//----------------------------------------------------------






//-----adress-----------------------------------------------
router.post('/addAddress', isLogged,addAddress)//post the adress add adres 
router.get('/editAddress', isLogged,loadEditAddress)//rendering the editaddrress page
router.post("/editAddress", isLogged,updateEditedAddress)//update a spesific address
router.get('/deleteAddress', isLogged,deleteAddress)//deleting a specific address
//---------------------------------------------






//-------------products--------------------------------------
router.get('/aProduct', isLogged,upload.single('images'), aProductPage)//rendering a single product page
router.get('/shop', shop)//rendering the shop page
router.get('/modal',modal)
//------------------------ ---------                       






//--------cart----------------------------------
router.get('/cart', isLogged,loadCart)//renderin the cart 
router.get('/addToCart', isLogged,addToCart)// adt a product to the cart
router.post('/test',isLogged,testAjax)//using ajax incrimet the quntity
router.post('/testdic',isLogged,testdic)//using ajx dicriment the quantity
router.post('/deleteItemeCart',isLogged,deleteItemeCart)//delete a product in the cart
router.get('/deleteCart',isLogged,deleteCart)//delete a item in cart
router.post('/updateCart',updateCart)
//-------------------------------------






//--------------------------oder--------------------------------
router.get('/selectPaymentMethord',isLogged,chekOut)//rendering the chekout page
router.get('/oderPage',isLogged,oderPage)//rendering the oder page
router.post('/oderPlaced',isLogged,oderPlaced)//confrming the order ans selet payment and address
router.get('/allOderData',isLogged,allOderData)//user get that spcific oder data
// router.get('/orderTracking',oderTraking)
router.get('/oderDetails',isLogged,oderDetails)//user vist hisorders details
router.get('/canselOrder',isLogged,canselOder)//canselng a orde
router.post('/verifyPayment',isLogged,verifyPayment)//
router.get('/return',isLogged,returnOrder)//delivered order return
router.get('/buyNOw',buyNOw)//a single produt buynow
router.post('/buynowPlaceOrder',buynowPlaceOrder)
//---------------------------------------



///---------wallet---------------

router.get('/sumWallet',sumWallet)//
router.post('/useWallet',useWallet)
//----------------------------------





//------------filter the things ----------------------
router.post('/filterSearch',filterSearch)//filter seach bar by catogay main bar
router.get('/sizeFilter',sizeFilter)///filtering the prudtc by size
router.get('/colorFilter',colorFilter)//by coler
router.get('/priceFilter',priceFilter)//by price
router.get('/brandFilter',brandFilter)//by brand
router.get('/CatogaryFilter',CatogaryFilter)//by catogary
router.get('/clearFilter',clearFilter)//clear all the filter 
router.get('/sortByPrice',sortByPrice)
//----------------------------------






//-----------------invoice------------
router.get('/invoice',isLogged,invoice)//renderin the invoice page
router.get('/invoices',isLogged,invoices)///user can douload invoice 
//==================================






//---wishlist-------------------
router.get('/Wishlist',isLogged,Wishlist)//rendering the wishlist
router.get('/addToList',isLogged,addToList)// add apriduct to the wish list
router.get('/deleteWishlistItem',isLogged,deleteWishlistItem)//delete a item in wish list
//------------------------------------



//------wallet--------------
router.post('/addMoneyWallet',isLogged,addMoneyWallet)
router.post('/updateMongoWallet',isLogged,updateMongoWallet)
router.post('/useWallet',isLogged,useWallet)
//------------------=-------------



//--------------coupon---------------
router.post('/validateCoupon',validateCoupon)
//----------------------------------------




//---------------rating and review----
router.post('/review',review)




router.use(errorHandler)

// Microsoft Routes
// router.get('/auth/microsoft', passport.authenticate('microsoft', { session: false }));
// router.get('/auth/microsoft/redirect', passport.authenticate('microsoft', { session: false, failureRedirect: `https://localhost:3000/login` }), (req, res) => {
//   res.redirect(req.user);
// });





module.exports = router
   