const asyncHandler=require('express-async-handler')
const User=require('../models/userModel')
const Product=require('../models/productModel')
//----------aadd a product to the wish lisy ---------------

const addToList=asyncHandler(async(req,res)=>{
    try {

const productId=req.query.id
console.log('this is thapoduct id pase to wishlist',productId);
        const userId= req.session.user;
        const user=await User.findById(userId);

        if(user){
            const productAlreadyExist = user.wishlist.some(item => item.productId === productId);

            if(productAlreadyExist){
console.log('this is thapoduct alredy exist',productAlreadyExist);

                res.redirect('/api/user')
            }else{
            
                user.wishlist.push({
                    productId:productId
                })

             const updateduser=   await user.save()
             res.redirect('/api/user')
console.log(updateduser,"this is updated user");
            }
        }else{
            console.log('threre is no user found ');
    }
    } catch (error) {
        console.log('Error happemce in the wishList ctrl in the function addToList',error);
    }
})
//--------------------------------------------------------------------




//-------------deldte a product in wishlist ---------------------

const deleteWishlistItem = asyncHandler(async (req, res) => {
    try {
        const prodId = req.query.id;
        const userId = req.session.user;

        const user = await User.findById(userId);

        if (user) {
            const productIndex = user.wishlist.findIndex(item => item.productId === prodId);

            if (productIndex !== -1) {
                // Remove the product at the found index from the wishlist array
                user.wishlist.splice(productIndex, 1);
                await user.save();
                res.redirect('/api/user/Wishlist')
            } else {
                // Product with the specified productId was not found in the wishlist
               console.log('no poduct found in wish list');
            }
        } else {
            // User not found
           console.log('user is not fout in eishlist');
        }
    } catch (error) {
        console.log('Error occurred in the wishlist ctrl in the function deleteproduct', error);
      
    }
});


//---------------------------------------------------------

//-------------------load wihlist ------------------

const Wishlist=asyncHandler(async(req,res)=>{
    try {
        const userId=req.session.user;
        const user=await User.findById(userId)

        const wishlist=user.wishlist;
        const productIds = wishlist.map(item => item.productId);

        // Use $in operator to find products with matching IDs
        const products = await Product.find({ _id: { $in: productIds } });
        console.log('this is porduct for wishlist',products);

        if (products) {
            res.render('wishList', { products: products });
        }
 
    } catch (error) {
        console.log('Error occurred in the wishlist ctrl in the function deleteproduct', error);
        
    }
})





module.exports={
    Wishlist,
    addToList,
    deleteWishlistItem
}