const asyncHandler=require('express-async-handler')
const User=require('../models/userModel')

const Razorpay=require('razorpay')


var instance = new Razorpay({ key_id:process.env.RAZORPAY_KEYID, key_secret: process.env.RAZORPAY_SECRETKEY })

//---------------add money to wallet --------------------
// Initialize Razorpay with your API keys
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEYID,
    key_secret: process.env.RAZORPAY_SECRETKEY,
});

// Modify your addMoneyWallet function
const addMoneyWallet = asyncHandler(async (req, res) => {
    try {
        const amount = req.body.amount;

        // Generate a unique order ID for each transaction
        const orderId = generateUniqueOrderId();
        const generatedOrder = await generateOrderRazorpay(orderId, amount);
       
        
       console.log('this is genmatrator the walet order',generateOrderRazorpay);
        res.json({razorpayOrder: generatedOrder,status:true})
    
    } catch (error) {
       console.log('Error hapence in the wallet ctrl in the funtion  addMoneyWallet',error);
        res.status(500).json({ error: "Internal server error" });
    }
});


function generateUniqueOrderId() {
    console.log('>>>>>>>>>>>>>>>>>>>>');
    const timestamp = Date.now();
    const uniqueId = Math.random().toString(36).substring(2, 15);
    return `order_${timestamp}_${uniqueId}`;
}

//---------------------------------------------------------
const generateOrderRazorpay = (orderId, total) => {
    return new Promise((resolve, reject) => {
        const options = {
            amount: total * 100,  // amount in the smallest currency unit
            currency: "INR",
            receipt: String(orderId)
        };
        instance.orders.create(options, function (err, order) {
            if (err) {
                console.log("failed");
                console.log(err);
                reject(err);
            } else {
                console.log("Order Generated RazorPAY: " + JSON.stringify(order));
                resolve(order);
            }
        });
    })
}

///--------------------------------------------------ended the add money to wallet----------------------------





//-----------------------------------updtate that amount that monfgo razor[pay added]------------

const updateMongoWallet = asyncHandler(async (req, res) => {
    try {
        const amount = parseFloat(req.body.amount); // Parse amount as a float

    //   console.log('this si the amount ;',amount);
        const userId = req.session.user;
    
        // console.log('this is ;',userId);

// const userdata = await User.findById(userId)      
// console.log('userdata',userdata); 



// console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',userdata.wallet);
// console.log('??????????????????????????????????????????????????????????????????',userdata.wallet[0]);
// console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',userdata.wallet[0].amount);

// res.json({a:userdata.wallet,b:userdata.wallet[0],c:userdata.wallet[0].amount})


        // Find the user by ID
        const user = await User.findByIdAndUpdate(userId, {
           $inc:{"wallet" : amount},
           $push:{
            "history":{
                amount:amount,
                status:"credit",
                timestamp:Date.now()
            }
           }
            
        }, { new: true });

        console.log('Updated user data:', user);

       if(user){
        res.json({status:true})

       }else{
        res.json({err:"user is not foundd"})
       }
        // if (user) {
        //     res.json({ status: true,user });
        // }else{
        //     res.json({mesge:"user not found"})
        // }
    } catch (error) {
        console.log('Error happened in the wallet ctrl in the function updateMongoWallet', error);
        res.status(500).json({ message: 'An error occurred while updating the wallet', error });
    }
});









//----------------------use full amount in wallet-and after that chose a paying methord ----------------------------------
//---------------------------------------------------------








//----------------------------pay with wallet =-----------------------------
//---------------------------------------------------------


module.exports={
    addMoneyWallet,
    updateMongoWallet
}