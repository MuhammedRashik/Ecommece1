const asyncHandler=require('express-async-handler')
const Coupon=require('../models/coupenModel');
const User=require('../models/userModel')






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
const addCoupon = asyncHandler(async (req, res) => {
  try {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",req.body);

      // Check if required fields are present in the request body
      if (!req.body.name || !req.body.discription || !req.body.offerPrice) {
          throw new Error('Required fields are missing');
      }

      let customExpiryDate = new Date(req.body.expiryDate);

      // Check if customExpiryDate is a valid date
      if (isNaN(customExpiryDate.getTime())) {
          // If it's an invalid date, set it to be one month from the current date
          const currentMonth = new Date().getMonth();
          const newExpiryDate = new Date();
          newExpiryDate.setMonth(currentMonth + 1);
          customExpiryDate = newExpiryDate;
      }

      const coupon = new Coupon({
          name: req.body.name,
          discription: req.body.discription,
          offerPrice: req.body.offerPrice,
          minimumAmount: req.body.minimumAmount,
          createdOn: Date.now(),
          expiryDate: customExpiryDate,
      });

      const create = await coupon.save();

      res.redirect('/api/admin/coupon');
  } catch (error) {
      console.log('Error happened in the coupon controller in the function addCoupon', error);
  }
});
//---------------------------------------------------------








//--------------rendering the coupen page with data-----------------
const coupon=asyncHandler(async(req,res)=>{
    try {
        const coupon= await Coupon.find()
        



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






const updateCoupon = asyncHandler(async (req, res) => {
    try {
      const id = req.body.id;
      const x = req.body;
  
     
      if (x.expiryDate) {
      
  
      
        const updatedCoupon = await Coupon.findByIdAndUpdate(
          id,
          {
            name: x.name,
            discription: x.discription,
            offerPrice: x.offerPrice,
            minimumAmount: x.minimumAmount,
            expiryDate: x.expiryDate,
          },
          { new: true }
        );
  
     
    
  
      
      } else {
       
        const updatedCoupon = await Coupon.findByIdAndUpdate(
          id,
          {
            name: x.name,
            discription: x.discription,
            offerPrice: x.offerPrice,
            minimumAmount: x.minimumAmount,
          },
          { new: true }
        );
  
       
      }
  
      res.redirect('/api/admin/coupon');
    } catch (error) {
      console.log('Error happened in the coupon controller in the function editCoupon', error);
    }
  });

  //--------------------------------------------------------------





//-------------chekthe coupon is valid or not -----------------
  const validateCoupon = asyncHandler(async (req, res) => {
    try {
      const name = req.body.couponCode;
  
      // Query the database to find the coupon by its name
      const coupon = await Coupon.findOne({ name: name });
  
      if (coupon) {
        const user = await User.findById(req.session.user)
        const userId={
          userId:user._id
        }

    

        coupon.user.push(userId)
        await coupon.save()
        // If a coupon with the provided name is found, send it as a JSON response
        res.status(200).json({
          isValid: true,
          coupon: coupon, // Include the coupon data in the response
        });
      } else {
        // If no coupon with the provided name is found, send an error response
        res.status(404).json({
          isValid: false,
          error: 'Coupon not found',
        });
      }
    } catch (error) {
      console.log('Error happened in the coupon controller in the function validateCoupon', error);
      res.status(500).json({
        isValid: false,
        error: 'An error occurred while processing your request',
      });
    }
  });
//---------------------------------------------------------











module.exports={
    loadCoupon,
    addCoupon,
    coupon,
    editCoupon,
    deleteCoupon,
    updateCoupon,
    validateCoupon
}