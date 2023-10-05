
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel.js')
const Product = require('../models/productModel.js');
const { response } = require('../routes/userRouter.js');
const Oder=require('../models/oderModel.js')






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


        if(product.quantity >= 1 ){
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
    
           res.json({status:true})

        }else{
            res.json({ status:false})
        }

        // Find the user by their ID
       
    } catch (error) {
        console.log('Error occurred in cart controller addToCart function', error);
        // Handle the error and possibly send an error response to the client
        // res.status(500).json({ error: 'Internal Server Error' });
    }
});

//---------------------------------------------------------







//-------------cart product quantity down-----------------------

const testdic=asyncHandler(async(req,res)=>{
    // console.log('iam here ajazx ------------------');
    try {
        const id = req.body.productId;
        const userId = req.session.user;

        // Find the user by their ID
        const user = await User.findById(userId);
        const product = await Product.findById(id);

if(user){
    const existingCartItem = user.cart.find(item => item.ProductId === id);
    // console.log('existing cart item ',existingCartItem);
    if(existingCartItem && existingCartItem.quantity > 0){
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
        const updatedUser= await user.save();
      
        const totalAmount=product.price * (existingCartItem.quantity - 1)
   
       
       
        
        res.json({ status: true ,quantityInput:existingCartItem.quantity-1,total:totalAmount});
    }
}
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, error: "Server error" });
    }

})
//----------------------------------------------------------------------------------








//----------------delete a cartitem-------------------------------------
const deleteItemeCart = asyncHandler(async (req, res) => {
    try {
        const id = req.body.productId;
        const userId = req.session.user;

        // Find the user by their ID
        const userData = await User.findById(userId);

        if (userData) {
            const existingCartItemIndex = userData.cart.findIndex(item => item.ProductId == id);

            if (existingCartItemIndex !== -1) {
                // If the item is found, remove it from the array
                userData.cart.splice(existingCartItemIndex, 1);
                await userData.save();
                res.json({ status: true });
            } else {
                // No existing cart item
                res.json({ status: false, error: 'Item not found in the cart.' });
            }
        } else {
            // No user data found
            res.json({ status: false, error: 'User not found.' });
        }

    } catch (error) {
        console.log('Error happened in cart ctrl in function deleteItemeCart', error);
        res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});

//--------------------------------------------------------------------------








//=====================ajax ++++++--Plus butten cart-----------------

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
                const newQuantity = existingCartItem.quantity + 1;
    
                // Check if the new quantity is within bounds (greater than 0 and not exceeding product quantity)
                if (newQuantity > 0 && newQuantity <= product.quantity) {
                // If the product is already in the cart, increment the quantity and update the subtotal using $inc
                const updated = await User.updateOne(
                    { _id: user, 'cart.ProductId': id },
                    {
                        $inc: {
                            'cart.$.quantity': 1, 
                        },
                        $set: {
                            'cart.$.subTotal': (product.price * (existingCartItem.quantity + 1)), // Update the subtotal
                        },
                    }
                );
            
                
                const updatedUser=  await userData.save();
               const totalAmount=product.price * (existingCartItem.quantity + 1)
                
           res.json({ status: true ,quantityInput:existingCartItem.quantity+1,total:totalAmount});
                }else{
                    res.json({status:false,error:'out of stoke'})
                }
              
            }       
            }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, error: "Server error" });
    }
});
// ...-------------------------------------------------------------------------------------





//---------------------thisis 


const updateCart = asyncHandler(async (req, res) => {
    try {
        console.log('i entered ');
        const id = req.body.productId;
        const userId = req.session.user;
        const count = req.body.count; // Added count parameter

      
        
        // Find the user by their ID
        const user = await User.findById(userId);
        const product = await Product.findById(id);

        if (user) {
           
            const existingCartItem = user.cart.find(item => item.ProductId === id);
          
            if (existingCartItem) {
                let newQuantity;
                if (count == 1) {
                  
                    // Increment quantity
                    newQuantity = existingCartItem.quantity + 1;
                   
                } else if (count == -1) {
                  
                    newQuantity = existingCartItem.quantity - 1;
                } else {
                   
                    return res.status(400).json({ status: false, error: "Invalid count" });
                }

                // Check if the new quantity is within bounds (greater than 0 and not exceeding product quantity)
                if (newQuantity > 0 && newQuantity <= product.quantity) {
                    const updated = await User.updateOne(
                        { _id: userId, 'cart.ProductId': id },
                        {
                            $set: {
                                'cart.$.quantity': newQuantity, // Update the quantity
                                'cart.$.subTotal': (product.price * newQuantity), // Update the subtotal
                            },
                        }
                    );
                   

                    const updatedUser = await user.save();
                   
                    const totalAmount = product.price * newQuantity;
                   
                    res.json({ status: true, quantityInput: newQuantity, total: totalAmount });
                } else {
      

                    res.json({ status: false, error: 'out of stock' });
                }
            }
        }
    } catch (error) {
        console.error('ERROR hapence in cart ctrl in the funtion update crt',error);
        return res.status(500).json({ status: false, error: "Server error" });
    }
});








//----------------------delete all eemnts in the cart -----------------------
const deleteCart=asyncHandler(async(req,res)=>{
    try {  
     
   
const userId = req.session.user;
    const user = await User.findById(userId);
    
user.cart=[]
    const updatedUser = await user.save();
   console.log('this sis updated user',updatedUser);
    res.json({status:true})
    } catch (error) {
        console.log('errro happemce in cart ctrl in function deletCart',error);     
    }

})
//------------------------------------------------------------------------------






//===================================exports------------------------
module.exports = {
    loadCart,
    addToCart,
    testAjax,
    testdic,
    deleteItemeCart,
    deleteCart,
    updateCart
    
}






