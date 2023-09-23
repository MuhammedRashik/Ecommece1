const asyncHandler=require('express-async-handler')
const Coupon=require('../models/coupenModel')

//---------------rendering the coupen add page---------------
const loadCoupon=asyncHandler(async(req,res)=>{
    try {
        res.render('addCoupon')
        
    } catch (error) {
        console.log('Error happence in the coupon controller in the funtion loadCoupon',error);
    }
})
//-----------------------------------------



//--------------------cerate a coupen whith coupen ----------------

const addCoupon=asyncHandler(async(req,res)=>{
    try {
     console.log(req.body);
     const x= req.body
     const coupon= new Coupon({
    name:x.name,
    discription:x.discription,
    offerPrice:x.offerPrice,
    minimumAmount:x.minimumAmount,
    createdOn:Date.now(),
    expiryDate:x.expiryDate
 })

 await coupon.save()

 res.redirect('/api/admin/coupon')
        
    } catch (error) {
        console.log('Error happence in the coupon controller in the funtion addCoupon',error);
        
    }
})


//--------------rendering the coupen page with data-----------------
const coupon=asyncHandler(async(req,res)=>{
    try {
        const coupon= await Coupon.find()
        console.log('thisis the coupon data ',coupon);



        const itemsperpage = 5;
        const currentpage = parseInt(req.query.page) || 1;
        const startindex = (currentpage - 1) * itemsperpage;
        const endindex = startindex + itemsperpage;
        const totalpages = Math.ceil(coupon.length / 5);
        const currentproduct = coupon.slice(startindex,endindex);

        res.render('coupon',{coupon,currentproduct, totalpages,currentpage})
        
    } catch (error) {
        console.log('Error happence in the coupon controller in the funtion coupon',error);
        
    }
})
//---------------------------------------------------


//--------------------------dlete a sinfle product ------------------------
const deleteCoupon=asyncHandler(async(req,res)=>{
    try {
        const id=req.query.id

        const coupon= await Coupon.findByIdAndDelete(id)

console.log('this the deleted adata ',coupon);

        res.redirect('/api/admin/coupon')



    } catch (error) {
        console.log('Error happence in the coupon controller in the funtion deleteCoupon',error);
        
    }
})
//--------------------------------------------------------------------



//-------------------rendring th edit coupon page with data in tha vlu------------
const editCoupon=asyncHandler(async(req,res)=>{
    try {
        const id =req.query.id
        const coupon = await Coupon.findById(id)

        res.render('editCoupon',{coupon})
        
    } catch (error) {
        console.log('Error happence in the coupon controller in the funtion editCoupon',error);
        
    }
})
//------------------------------------------------------



const updateCoupon=asyncHandler(async(req,res)=>{
    try {
        const id= req.body.id
       
const x=req.body
const expiryDate = new Date(x.expiryDate);

if(expiryDate){
    const coupon= await Coupon.findByIdAndUpdate(id,{
        name:x.name,
discription:x.discription,
offerPrice:x.offerPrice,
minimumAmount:x.minimumAmount,
expiryDate:expiryDate

    },{new:true})

}else{
    const coupon= await Coupon.findByIdAndUpdate(id,{
        name:x.name,
        discription:x.discription,
        offerPrice:x.offerPrice,
        minimumAmount:x.minimumAmount,


    },{new:true})
}
       
        console.log('thie si updated coupon',coupon);
        res.redirect('/api/admin/coupon')
        
    } catch (error) {
        console.log('Error happence in the coupon controller in the funtion editCoupon',error);
        
    }
})



module.exports={
    loadCoupon,
    addCoupon,
    coupon,
    editCoupon,
    deleteCoupon,
    updateCoupon
}