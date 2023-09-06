const express=require('express')
const router=express();
const {loadIndex,loadSignIn,loadSignUp,registerUser,userLogin,userLogout  ,mobileOTP  ,emailVerified ,forgotPsdPage,forgotEmailValid,forgotPsdOTP ,updatePassword}=require('../controllers/userCtrl')
const {isAuth,isBloked}=require('../middleware/auth')
const {aProductPage,shop}=require('../controllers/productCtrl')
const {loadCart,addToCart}=require('../controllers/cartCtrl')
const {upload}=require('../multer/multer')
router.set('view engine','ejs'); 
router.set('views','./views/user');

//----------------user-----------------------------------
router.get('/',isBloked,isAuth,loadIndex)//load the indexpage 
router.get('/login',isBloked,isAuth,loadSignIn)//load the sign in page 
router.get('/register',isBloked,loadSignUp)//load the signup page 
router.post('/register',isBloked,registerUser)//signup a user with data aand otp send 
router.post('/login',isBloked,userLogin)// user login with data and session created
router.get('/logout',userLogout)//user logout and session delete
router.post('/emailVerified',emailVerified)//otp verification 
router.get('/forgotPassword',forgotPsdPage)//rendering the forgot passrod page 
router.post('/forgotEmailValid',forgotEmailValid)
router.post('/forgotPsdOTP',forgotPsdOTP)
router.post('/updatePassword',updatePassword)
router.get("/mobileOTP",mobileOTP) //mobile otp verification page do it later
//----------------------------------------------------------




//-------------products--------------------
router.get('/aProduct',upload.single('images'),aProductPage)//rendering a single product page
router.get('/shop',shop)

//------------------------------------


//--------cart---------------------
router.get('/cart',loadCart)
router.get('/addToCart',addToCart)




module.exports=router
                                   