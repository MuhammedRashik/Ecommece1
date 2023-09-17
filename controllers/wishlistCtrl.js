const asyncHandler=require('express-async-handler')
const User=require('../models/userModel')

//----------aadd a product to the wish lisy ---------------

const addToList=asyncHandler(async(req,res)=>{
    try {

const productId=req.query.prodId

        const userId= req.session.user;
        const user=await User.findById(userId);

        if(user){
            const productAlreadyExist = user.wishlist.some(item => item.productId === productId);

            if(productAlreadyExist){
                res.redirect('/api/user')
            }else{
            
                user.wishlist.push({
                    productId:productId
                })

                await user.save()
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

const deleteproduct = asyncHandler(async (req, res) => {
    try {
        const prodId = req.query.prodId;
        const userId = req.session.user;

        const user = await User.findById(userId);

        if (user) {
            const productIndex = user.wishlist.findIndex(item => item.productId === prodId);

            if (productIndex !== -1) {
                // Remove the product at the found index from the wishlist array
                user.wishlist.splice(productIndex, 1);
                await user.save();
                
            } else {
                // Product with the specified productId was not found in the wishlist
                res.status(404).send('Product not found in wishlist.');
            }
        } else {
            // User not found
            res.status(404).send('User not found.');
        }
    } catch (error) {
        console.log('Error occurred in the wishlist ctrl in the function deleteproduct', error);
        res.status(500).send('Internal server error.');
    }
});


//---------------------------------------------------------