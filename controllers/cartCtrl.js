
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


//-------------cart product quantity up-----------------------






  // ...


   

 
  



//--------------------------------------------------

//------------------------------------

  



  

  

//===============================================================

async function changeQty(userId, productId, change, index) {
    try {
        console.log('hai');
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ status: false, msg: "User not found" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.json({ status: false, msg: "Product not found" });
        }

        const cartItem = user.cart.find(item => item.ProductId.toString() === productId);
        if (!cartItem) {
            return res.json({ status: false, msg: "Cart item not found" });
        }

        const newQuantity = cartItem.quantity + change;

        if (newQuantity < 1) {
            return res.json({ status: false, msg: "Quantity cannot be less than 1" });
        }

        if (newQuantity > product.stock) {
            return res.json({ status: false, msg: "Quantity exceeds available stock" });
        }

        cartItem.quantity = newQuantity;
        cartItem.subTotal = product.price * newQuantity;

        await user.save();

        res.json({ status: true, newQuantity, newSubTotal: cartItem.subTotal });
    } catch (error) {
        console.error("Error changing quantity:", error);
        res.status(500).json({ status: false, msg: "Unable to update quantity" });
    }
}
//----------------------------------------------------------------
async function removeCartItem(userId, productId) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ status: false, msg: "User not found" });
        }

        const cartItemIndex = user.cart.findIndex(item => item.ProductId.toString() === productId);
        if (cartItemIndex === -1) {
            return res.json({ status: false, msg: "Cart item not found" });
        }

        user.cart.splice(cartItemIndex, 1);
        await user.save();

        res.json({ status: true });
    } catch (error) {
        console.error("Error removing cart item:", error);
        res.status(500).json({ status: false, msg: "Unable to remove cart item" });
    }
}




















//=====================ajax try-------------------

const testAjax = asyncHandler(async (req, res) => {
    
    try {

        console.log('iam here in he ajax ++++');
    console.log(req.body);
        const id = req.body.productId;
        const user = req.session.user;
console.log('this is product id',id);
console.log('this is user ',user);

        // Find the product by its ID
        const product = await Product.findById(id);

        // Find the user by their ID
        const userData = await User.findById(user);

        if (userData) {
            // Check if the product is already in the cart
            const existingCartItem = userData.cart.find(item => item.ProductId === id);
            console.log('iam existing prduct ',existingCartItem);

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
          console.log('this is updtaed userr',updatedUser);
          return res.json({ status: true ,quantityInput:existingCartItem.quantity+1});
            }
          
            }
           



//         console.log('this is product id',product);
// console.log('this is user ',userData);


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
    changeQty,

   







}


// // If the product is already in the cart, update the existing entry
// existingCartItem.quantity=existingCartItem.quantity+1;
// existingCartItem.subTotal = existingCartItem.quantity * product.price;



