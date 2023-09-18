// const User=require('../models/userModel')



// const confirmation = async (req, res, next) => {
//     try {
//         console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<',req.body.payment,'this is payment >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');

//         const status = req.body.payment;

//         const userData = await User.findById(req.session.user);
//         console.log(userData, "00000");
//         const items = [];

//         let canPlaceOrder = true; // Initialize a flag to check if the order can be placed

//         for (let i = 0; i < userData.cart.length; i++) {
//             const product = await productModel.findById(userData.cart[i].productId);

//             if (product) {
//                 if (product.quantity < 1) {
//                     canPlaceOrder = false; // Product quantity is below 1, cannot place the order
//                     console.error(`Product with ID ${product._id} has quantity below 1.`);

//                     break; // Exit the loop when a product quantity is below 1
//                 } else {
//                     const temp = {
//                         product: product._id,
//                         quantity: userData.cart[i].quantity,
//                         price: product.sale_price,
//                     };
//                     items.push(temp);

//                     const updatedDetails = await productModel.findByIdAndUpdate(
//                         temp.product,
//                         { $inc: { quantity: parseInt(temp.quantity, 10) } },
//                         { new: true }
//                     );

//                     console.log(updatedDetails, "Updated Product Details");
//                 }
//             } else {
//                 // Handle the case where the product doesn't exist
//                 console.error(`Product with ID ${userData.cart[i].productId} not found.`);
//             }
//         }

//         if (!canPlaceOrder) {
//             // Redirect back when a product quantity is below 1
//             res.redirect('/your-redirection-path'); // Replace with your desired redirection path
//             return; // Exit the function early
//         }

//         const order = await orderModel.create({
//             user: req.session.user._id,
//             items,
//             address: userData.address[0],
//             paymentMode: status,
//             discount: req.body.discount,
//             totalAmount: 0,
//             finalAmount: 0,
//         });

//         console.log(order, "Order Created");

//         if (order.paymentMode === 'cod') {
//             console.log("COD: " + order.paymentMode);
//             id = req.session.user._id
//             await user.findByIdAndUpdate(id, { $set: { "cart": [] } })
//                 .then((data) => {
//                     console.log("cart deleted");

//                 }).catch((err) => {
//                     console.log("cart not deleted");

//                 })

//             res.json({ payment: true, method: "cod", order: order });

//         } else if (order.paymentMode === 'online') {
//             const generatedOrder = await generateOrderRazorpay(order._id, order.finalAmount);
//             res.json({ payment: false, method: "online", razorpayOrder: generatedOrder, order: order });
//         }
//         else if (order.paymentMode === 'wallet') {
//             id = req.session.user._id
//             await user.findByIdAndUpdate(id, { $set: { "cart": [] } })
//                 .then((data) => {
//                     console.log("cart deleted");

//                 }).catch((err) => {
//                     console.log("cart not deleted");

//                 })

//             await user.findByIdAndUpdate(id, {
//                 $push: {
//                     wallet: { amount: Number(-order.finalAmount), timestamp: Date.now(), paymentType: "D" }
//                 }
//             })
//                 .then((data) => {
//                     console.log(data?.wallet);
//                 })

//             res.json({ payment: true, method: "cod", order: order });

//         }
//     } catch (err) {
//         next(err)
//         res.status(500).send("Internal Server Error");
//     }
// };

// const Razorpay = require('razorpay');
// const { Transaction } = require("mongodb");
// const userModel = require("../model/userModel");
// const { log } = require("console");
// // const { default: items } = require("razorpay/dist/types/items");
// const instance = new Razorpay({ key_id: 'rzp_test_kkytoEMYHJ1dn3', key_secret: 'Kp0HLNQxAwymJ5fe4CSNSSH7' });

// const generateOrderRazorpay = (orderId, total) => {
//     return new Promise((resolve, reject) => {
//         const options = {
//             amount: total * 100,  // amount in the smallest currency unit
//             currency: "INR",
//             receipt: String(orderId)
//         };
//         instance.orders.create(options, function (err, order) {
//             if (err) {
//                 console.log("failed");
//                 console.log(err);
//                 reject(err);
//             } else {
//                 console.log("Order Generated RazorPAY: " + JSON.stringify(order));
//                 resolve(order);
//             }
//         });
//     })
// }
// const verifyOrderPayment = (details) => {
//     console.log("DETAILS : " + JSON.stringify(details));
//     return new Promise((resolve, reject) => {
//         const crypto = require('crypto');
//         let hmac = crypto.createHmac('sha256', 'Ag95tYV92s1TcaDaz0Ix79A8')
//         hmac.update(details.payment.razorpay_order_id + '|' + details.payment.razorpay_payment_id);
//         hmac = hmac.digest('hex');
//         if (hmac == details.payment.razorpay_signature) {
//             console.log("Verify SUCCESS");
//             resolve();
//         } else {
//             console.log("Verify FAILED");
//             reject();
//         }
//     })
// };

// const verifyRazorpayPayment = (req, res, next) => {
//     try {
//         verifyOrderPayment(req.body)
//             .then(async () => {
//                 console.log("Payment SUCCESSFUL");


//                 res.json({ status: true });


//             }).catch((err) => {
//                 console.log(err);
//                 res.json({ status: false, errMsg: 'Payment failed!' });
//             });
//     } catch (err) {
//         next(err)
//         res.json({ status: false, errMsg: 'Payment failed!' });
//     }
// };


// module.exports={
//     confirmation
// }