
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel.js')
const Product = require('../models/productModel.js');
const { response } = require('../routes/userRouter.js');



//-------renderin the cart page --------------------
const loadCart = asyncHandler(async (req, res) => {
    try {
        const id = req.session.user
        const user = await User.findById(id)
        // console.log(user.cart.ProductId);
        // const products =await Product.find({_id:user.cart})



        const productIds = user.cart.map(cartItem => cartItem.ProductId);
        // console.log('product is +>>>>>>>>>>>>>>>>>>>>>>>>>',productIds);

        // Find products that match the extracted product IDs
        const product = await Product.find({ _id: { $in: productIds } });
        // console.log('product is +>>>>>>>>>>>>>>>>>>>>>>>>>',product);

        //    const cart=user.cart
        let totalSubTotal = 0;
        let quantity = 0;
        for (const item of user.cart) {
            totalSubTotal += item.subTotal;
            quantity += item.quantity
        }
        // console.log(totalSubTotal);

        res.render('cart', { product, cart: user.cart, quantity, totalSubTotal,user });
    } catch (error) {
        console.log('Error Happence in cart controller loadCart function ', error);
    }
})
//----------------------------------------------




//-------------add a product to a cart -----------------------
const addToCart = asyncHandler(async (req, res) => {
    try {
        const id = req.query.id;
        const user = req.session.user;

        // Find the product by its ID
        const product = await Product.findById(id);

        // Find the user by their ID
        const userData = await User.findById(user);

        if (userData) {
            // Check if the product is already in the cart
            const existingCartItem = userData.cart.find(item => item.ProductId === id);

            if (existingCartItem) {
                // If the product is already in the cart, increment the quantity and update the subtotal using $inc
                const updated = await User.updateOne(
                    { _id: user, 'cart.ProductId': id },
                    {
                        $inc: {
                            'cart.$.quantity': 1, // Increment the quantity
                            'cart.$.subTotal': product.price, // Update the subtotal
                        },
                    }
                );

            } else {
                // If the product is not in the cart, add it as a new entry
                userData.cart.push({
                    ProductId: id,
                    quantity: 1,
                    total: product.price,
                    subTotal: product.price, // Initial subtotal is the same as the product price
                });

                await userData.save();

            }
        }

        res.redirect('/api/user');
    } catch (error) {
        console.log('Error occurred in cart controller addToCart function', error);
        // Handle the error and possibly send an error response to the client
        // res.status(500).json({ error: 'Internal Server Error' });
    }
});

//---------------------------------------------------------




//-------------cart product quantity down-----------------------

const testdic=asyncHandler(async(req,res)=>{
    console.log('iam here ajazx ------------------');
    try {
        const id = req.body.productId;
        const userId = req.session.user;

        // Find the user by their ID
        const user = await User.findById(userId);
        const product = await Product.findById(id);

if(user){
    const existingCartItem = user.cart.find(item => item.ProductId === id);
    console.log('existing cart item ',existingCartItem);
    if(existingCartItem){
        const updated = await User.updateOne(
            { _id: userId, 'cart.ProductId': id },
            {
                $inc: {
                    'cart.$.quantity': -1, // Decrement the quantity by 1
                },
                $set: {
                    'cart.$.subTotal': (product.price * (existingCartItem.quantity - 1)), // Update the subtotal after decrement
                },
            }
        );
        const updatedUser=  await user.save();
        console.log('this is update user form the dcreiment side ',updatedUser);
        res.json({ status: true ,quantityInput:existingCartItem.quantity-1});
    }

}
      



    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, error: "Server error" });
    }

})



const deleteItemeCart=asyncHandler(async(req,res)=>{
    try {
      
        const id = req.body.productId;
        const userId = req.session.user;
        
        const product = await Product.findById(id);

        // Find the user by their ID
        const userData = await User.findById(userId);

if(userData){
    const existingCartItem = userData.cart.find(item => item.ProductId === id);
   
    if(existingCartItem){
        userData.cart.splice(existingCartItem, 1);
        await userData.save();
    }else{
        //no existing cart item
    }
}else{
    //no user data found
}

       




        res.json({status:true})
        
    } catch (error) {
       console.log('errro happemce in cart ctrl in function deleteItemeCart'); 
    }
})









//=====================ajax ++++++-------------------

const testAjax = asyncHandler(async (req, res) => {
    
    try {

        
    // console.log(req.body);
        const id = req.body.productId;
        const user = req.session.user;
//

        // Find the product by its ID
        const product = await Product.findById(id);

        // Find the user by their ID
        const userData = await User.findById(user);

        if (userData) {
            // Check if the product is already in the cart
            const existingCartItem = userData.cart.find(item => item.ProductId === id);
     

            if (existingCartItem) {
                // If the product is already in the cart, increment the quantity and update the subtotal using $inc
                const updated = await User.updateOne(
                    { _id: user, 'cart.ProductId': id },
                    {
                        $inc: {
                            'cart.$.quantity': 1, // Increment the quantity
                        },
                        $set: {
                            'cart.$.subTotal': (product.price * (existingCartItem.quantity + 1)), // Update the subtotal
                        },
                    }
                );
                const updatedUser=  await userData.save();
          
           res.json({ status: true ,quantityInput:existingCartItem.quantity+1});
            }       
            }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, error: "Server error" });
    }
});
// ...

// In your routes or controllers, you can call these functions like this:
// changeQty(userId, productId, change, index);
// removeCartItem(userId, productId);
//===================================exports------------------------


module.exports = {
    loadCart,
    addToCart,
    testAjax,
    testdic,
    deleteItemeCart
   







}


// // If the product is already in the cart, update the existing entry
// existingCartItem.quantity=existingCartItem.quantity+1;
// existingCartItem.subTotal = existingCartItem.quantity * product.price;



