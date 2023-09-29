// Create a new review for a product
const asyncHandler=require('express-async-handler')
const Oder=require('../models/oderModel')
const Product=require('../models/productModel')




const review = asyncHandler(async (req, res) => {
    try {
      const userId = req.session.user;
      const { comment, rating, productId, orderId } = req.body;
  
      const order = await Oder.findById(orderId);
      const product = await Product.findById(productId);
  
      if (!product) {
        // Product not found, handle the error
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Initialize individualRatings as an array if it's not already
      if (!product.rating.individualRatings) {
        product.rating.individualRatings = [];
      }
  
      // Create a new rating object
      const newRating = {
        star: rating,
        review: comment,
        postedBy: userId,
      };
  
      // Add the new rating to the individualRatings array of the product's rating
      product.rating.individualRatings.push(newRating);
  
      // Update the average rating and total ratings
      const totalRatings = product.rating.individualRatings.length;
      const sumRatings = product.rating.individualRatings.reduce((sum, rating) => sum + parseInt(rating.star), 0);
      product.rating.average = sumRatings / totalRatings;
      product.rating.totalRatings = totalRatings;
  
      // Save the updated product
      const updatedProduct = await product.save();
  console.log('this is the last updated product',updatedProduct);
    
      res.redirect(`/api/user/oderDetails?orderId=${orderId}`);
    } catch (error) {
      console.log('Error Happened in review Ctrl in the function review', error);
      // Handle the error appropriately, e.g., res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  

              
  //-------------------------------------------------
  

module.exports={
    review
}

