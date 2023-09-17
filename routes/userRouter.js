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
    deleteCart,
    

  

} = require('../controllers/cartCtrl')
//----------------------





//----------oderCtrl----------------
const {
    oderPage,
    chekOut,
    oderPlaced,
    allOderData,
    oderDetails,
    canselOder
    
}=require('../controllers/oderCtrl')
//------------------------------------





///-----------filter ctrl-----
const {filterSearch}=require('../controllers/filter.Ctrl')
//-------------------------------------------






//------------------invoice ctrl-----------
const {invoice}=require('../controllers/invoiceCtrl')



///////////////////////////////////////////////////--require end--/////////////////////////////





//----engine-----------
router.set('view engine', 'ejs');
router.set('views', './views/user');
//-------------------------




//----------------user-----------------------------------
router.get('/', loadIndex)//load the indexpage 
router.get('/login', loadSignIn)//load the sign in page 
router.get('/register', loadSignUp)//load the signup page 
router.post('/register', registerUser)//signup a user with data aand otp send 
router.post('/login', userLogin)// user login with data and session created
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
router.get('/deleteCart',deleteCart)//delete a item in cart
//-------------------------------------





//-------oder--------------------
router.get('/selectPaymentMethord',chekOut)//rendering the chekout page
router.get('/oderPage',oderPage)//rendering the oder page
router.post('/oderPlaced',oderPlaced)//confrming the order ans selet payment and address
router.get('/allOderData',allOderData)//user get that spcific oder data
// router.get('/orderTracking',oderTraking)
router.get('/oderDetails',oderDetails)//user vist hisorders details
router.get('/canselOrder',canselOder)//canselng a orde
//----------------------------------


//------------filter the things ----------------------
router.post('/filterSearch',filterSearch)
//----------------------------------


//-----------------invoice------------
router.get('/invoice',invoice)



//-----for test-----
// router.get('/testEjs',(req,res)=>{
//     res.render('oderTraking')
// })

//----------------      

module.exports = router
   