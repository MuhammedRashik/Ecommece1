const express = require('express')
const router = express();
//-------------------------------------





//-/////////////////////////////////////////-required-/////////////////////////////





//---------multer----------
const { upload } = require('../multer/multer')
//-----------------------





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
    addProficPic


} = require('../controllers/userCtrl')
//-----------------------------------------------





//------------auth Midleware-------------
const { 
    isAuth,
    isBloked 

} = require('../middleware/auth')
//------------------------------------------





//-----------------productCtrl------------------
const { 
    aProductPage,
    shop 

} = require('../controllers/productCtrl')
//----------------------------------------------





//----------------cart------------------
const { 
    loadCart,
    addToCart,
    testdic,
    testAjax,
    deleteItemeCart,
    deleteCart

  

} = require('../controllers/cartCtrl')
//----------------------





//----------oderCtrl----------------
const {
    oderPage,
    chekOut,
    oderPlaced,
    allOderData
    
}=require('../controllers/oderCtrl')
//------------------------------------





///////////////////////////////////////////////////--require end--/////////////////////////////





//----engine-----------
router.set('view engine', 'ejs');
router.set('views', './views/user');
//-------------------------




//----------------user-----------------------------------
router.get('/', loadIndex)//load the indexpage 
router.get('/login', loadSignIn)//load the sign in page 
router.get('/register', isBloked, loadSignUp)//load the signup page 
router.post('/register', isBloked, registerUser)//signup a user with data aand otp send 
router.post('/login', isBloked, userLogin)// user login with data and session created
router.get('/logout', userLogout)//user logout and session delete
router.post('/emailVerified', emailVerified)//otp verification 
router.get('/forgotPassword', forgotPsdPage)//rendering the forgot passrod page 
router.post('/forgotEmailValid', forgotEmailValid)//email cheking forgot password
router.post('/forgotPsdOTP', forgotPsdOTP)//otp send and chek
router.post('/updatePassword', updatePassword)//if otp corect update the password
router.get("/mobileOTP", mobileOTP) //mobile otp verification page do it later
router.get('/profile', userProfile)//renderig profile
router.get('/editProfile', editProfile)//rendering the user profile edit page
router.post('/updateProfile', updateProfile)//updating the user profile--
router.post('/addProficPic', upload.single('image'), addProficPic)
//----------------------------------------------------------





//-----adress-----------------------------------------------
router.post('/addAddress', addAddress)//post the adress add adres 
router.get('/editAddress', loadEditAddress)//rendering the editaddrress page
router.post("/editAddress", updateEditedAddress)//update a spesific address
router.get('/deleteAddress', deleteAddress)//deleting a specific address
//---------------------------------------------





//-------------products--------------------------------------
router.get('/aProduct', upload.single('images'), aProductPage)//rendering a single product page
router.get('/shop', shop)//rendering the shop page
//------------------------ ---------                       





//--------cart----------------------------------
router.get('/cart', loadCart)//renderin the cart 
router.get('/addToCart', addToCart)// adt a product to the cart
router.post('/test',testAjax)//using ajax incrimet the quntity
router.post('/testdic',testdic)//using ajx dicriment the quantity
router.post('/deleteItemeCart',deleteItemeCart)//delete a product in the cart
router.get('/deleteCart',deleteCart)
//-------------------------------------





//-------oder--------------------
router.get('/selectPaymentMethord',chekOut)
router.get('/oderPage',oderPage)
router.post('/oderPlaced',oderPlaced)
router.get('/allOderData',allOderData)
//----------------------------------



//-----for test-----
router.get('/testEjs',(req,res)=>{
    res.render('oderList')
})

//----------------

module.exports = router
   