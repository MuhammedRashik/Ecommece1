const asyncHandler=require('express-async-handler');
var easyinvoice = require('easyinvoice');
const { Readable } = require("stream");


//-------------rendering the invoive page----------

const invoice=asyncHandler(async(req,res)=>{
    try {
        res.render('invoice')
    } catch (error) {
        console.log('Error hapence in invoice controller in the funtion invoice',error);
    }
})
//------------------------------------------

//------------invoicesend------------

const sendInvoice=asyncHandler(async(req,res)=>{
    try {
        const id = req.query.id;
         const userId = req.session.user;
    } catch (error) {
        console.log('Error hapence in invoice controller in the funtion sendInvoice',error);
        
    }
})






// const users = require("../model/user-model");
// const nodemailer = require("nodemailer");
// const mongodb = require("mongodb");
// const orderModel = require("../model/order-model");
// const { log } = require("debug/src/browser");
// // const easyinvoice = require('easyinvoice');
// // const { Readable } = require("stream");
// const banner = require("../model/banner-model");
// const Razorpay = require("razorpay");

// require("dotenv").config();
 
const invoices=async(req,res)=>{
  try {
          const id = req.query.id;
          const userId = req.session.user;
          const result = await orderModel.findOne({ _id: id }); 
          const user = await users.findOne({ _id: userId });      
          const address = result.address
          const order = {
            id: id,
            total: result.totalPrice,
            date: result.createdOn, // Use the formatted date
            paymentMethod: result.payment,
            orderStatus: result.status,
            name: address[0].name,
            number: address[0].number,
            house:address[0].house,
            pincode: address[0].pinCode,
            town: address[0].town,
            state: address[0].state,
            product: result.product,
          };
          //set up the product
          let oid = new mongodb.ObjectId(id)
          let Pname =  await orderModel.aggregate([
              {$match:{_id:oid}},
              {$unwind:'$product'},
              {$project:{
                  proId:{$toObjectId:'$product.productId'},
                  quantity:'$products.quantity',
                  Size:'$product.size',
                  totalPrice:'$totalPrice'  
              }},
              {$lookup:{ 
                  from:'products',
                  localField:'proId',
                  foreignField:'_id',
                  as:'ProductDetails',
              }},
              {
                  $project: {
                      quantity: '$quantity',
                      description: { $arrayElemAt: ['$ProductDetails.name', 0] },
                      price: { $arrayElemAt: ['$ProductDetails.saleprice', 0] },
                      total: '$totalPrice',
                      "tax-rate": '1',
                      _id:0
                  }
              }
          ])
          const products = order.product.map((product,i) => ({
                  quantity: parseInt(product.quantity),
                  description: Pname[i].description,
                  price: parseInt(Pname[i].price),
                  total: parseInt(result.totalPrice),
                  "tax-rate": 0,
                }));
          
          
          console.log(order,'ooo');
          console.log(Pname,'ooo');
          const isoDateString = order.date;
          const isoDate = new Date(isoDateString);
      
          const options = { year: "numeric", month: "long", day: "numeric" };
          const formattedDate = isoDate.toLocaleDateString("en-US", options);
          const data = {
            customize: {
              //  "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html
            },
            images: {
              // The invoice background
              background: "",
            },
            // Your own data
            sender: {
              company: "Stepz",
              address: "Stepz Shop Kochi",
              city: "Ernakulam",
              country: "India",
            },
            client: {
              company: "Customer Address",
              "zip": order.name,
              "city": order.house,
              "address": order.pincode,
              // "custom1": "custom value 1",
              // "custom2": "custom value 2",
              // "custom3": "custom value 3"
            },
            information: {
              number: "order" + order.id,
              date: formattedDate,
            },
            products: products,
            "bottom-notice": "Happy shoping and visit Stepz again",
          };
      let pdfResult = await easyinvoice.createInvoice(data);
          const pdfBuffer = Buffer.from(pdfResult.pdf, "base64");
      
          // Set HTTP headers for the PDF response
          res.setHeader("Content-Disposition", 'attachment; filename="invoice.pdf"');
          res.setHeader("Content-Type", "application/pdf");
      
          // Create a readable stream from the PDF buffer and pipe it to the response
          const pdfStream = new Readable();
          pdfStream.push(pdfBuffer);
          pdfStream.push(null);
      
          pdfStream.pipe(res);
        } catch (error) {
          console.log(error);
          res.status(500).json({ error: error.message });
        }
}








module.exports={
    invoice
}