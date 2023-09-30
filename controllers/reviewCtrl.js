// Create a new review for a product
const asyncHandler=require('express-async-handler')
const Oder=require('../models/oderModel')
const Product=require('../models/productModel')
require('mongoose').mongoose.BSON = require('bson');
const BSON = require('bson');


const review = asyncHandler(async (req, res) => {
    try {

        
      const userId = req.session.user;
      const { comment, rating, productId, orderId } = req.body;
  
      console.log('this is body ',req.body);
     
      const product = await Product.findById(productId);


      const newRating = {
        star: Number(rating),
        review: comment,
        postedBy: new BSON.ObjectId(userId),
      };
      


  const existingRatingIndex = product.individualRatings.findIndex(
    (rating) => String(rating.postedBy) === String(userId)
  );

  console.log(existingRatingIndex,"<<<<<<<<<<<");

  if (existingRatingIndex !== -1) {
    // Update the existing rating if found
    product.individualRatings[existingRatingIndex] = newRating;
  } else {
    console.log('JJJJJJJ');
    // Add a new rating if not found
    product.individualRatings.push(newRating);
  }

  // Recalculate the average rating and total ratings
  const totalRatings = product.individualRatings.length;
  const sumRatings = product.individualRatings.reduce((sum, rating) => sum + rating.star, 0);
  const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

  // Update the product with the new average rating and total ratings
  product.rating = {
    average: averageRating,
    totalRatings: totalRatings,
  };
  console.log('Before serialization:', product);
const updatePr = await product.save();
console.log('After serialization:', updatePr);
  
 
 
    res.redirect(`/api/user/aProduct?id=${productId}`);






    } catch (error) {
      console.log('Error Happened in review Ctrl in the function review', error);
    
    }
  });
  
  

              
  //-------------------------------------------------
  

module.exports={
    review
}







// if (!product) {
//     // Product not found, handle the error
//     return res.status(404).json({ message: 'Product not found' });
//   }

//   // Initialize individualRatings as an array if it's not already
//   if (!product.rating.individualRatings) {
//     product.rating.individualRatings = [];
//   }

//   // Create a new rating object
//   const newRating = {
//     star: rating,
//     review: comment,
//     postedBy: userId,
//   };

//   // Add the new rating to the individualRatings array of the product's rating
//   product.rating.individualRatings.push(newRating);

//   // Update the average rating and total ratings
//   const totalRatings = product.rating.individualRatings.length;
//   const sumRatings = product.rating.individualRatings.reduce((sum, rating) => sum + parseInt(rating.star), 0);
//   product.rating.average = sumRatings / totalRatings;
//   product.rating.totalRatings = totalRatings;

//   // Save the updated product
//   const updatedProduct = await product.save();
// console.log('this is the last updated product',updatedProduct);

//   res.redirect(`/api/user/oderDetails?orderId=${orderId}`);