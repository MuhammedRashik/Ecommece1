const express=require('express');
const router=express();

const {isAdminAuth}=require('../middleware/adminAuth')
const {loadLogin,adminVerifyLogin,logout,adminDashbordPage,users,blokeUser,unBlokeUser}=require('../controllers/adminCtrl')
const {loadCatogary ,getAllCatogary ,addCatogary,deleteCatogary,listCatogary,unlistCatogary,editCatogary,updateCatogary}=require('../controllers/catogaryCtrl')
const {getAllProducts ,addProduct ,createProduct,editProduct,productEdited ,aProductPage,listProduct,unlistProduct }=require('../controllers/productCtrl')
const {orderListing,oderDetailsAdmin}=require('../controllers/oderCtrl')





//------engine set up------------
router.set('view engine','ejs'); 
router.set('views','./views/admin');
//-------------------------------




//----------multer setting---------------
const {upload}=require('../multer/multer')
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
router.get('/product',getAllProducts)//load all data and rendering the product page
router.get('/product/:page', getAllProducts);
router.get('/addProduct',addProduct)//rendering the addproduct page
router.post('/createProduct',upload.array('images', 12),createProduct)//creating a new product 
router.get('/editProduct',editProduct)//rendering a spesific proct edit page
router.post('/productEdited',upload.array('images', 12),productEdited)//after editing update thta data to db
router.get('/unlistProduct',unlistProduct)// unlisting tht prduct
router.get('/listProduct',listProduct)// listing tht product
//--------------------------------------------------------
 




//-------------catogary-----------------------------------
router.get('/catogary',getAllCatogary)//rendering catogary page
router.post('/addCatogary',upload.single('image'),addCatogary)//ading a new catogory to the data bsae and show it
router.get('/deleteCatogary',deleteCatogary)
router.get('/editCatogary',editCatogary)//rendering the edit catogary page with that specific user data
router.get('/unlistCatogary',unlistCatogary)//when catogary listed ulist that
router.get('/listCatogary',listCatogary)//when catogary is unlistedlist that
router.post('/updateCatogary',upload.single('image'),updateCatogary)//after rendering the edit catogary page update the catogory data to db
//-------------------------------------------------------              
 




//----------------------order-----------------------------
router.get('/orderListing',orderListing)//show all the orders to the admin page
router.get('/oderDetailsadmin',oderDetailsAdmin)


//------------------------------------------------------------



//===============testing ejs ============
// router.get('/testEjs',(req,res)=>{
//     res.render('oderList')
// })

//------------------------






module.exports=router