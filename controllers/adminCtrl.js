const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Oder=require('../models/oderModel')
const Product= require('../models/productModel')
const Catogary=require('../models/catogaryModel')
const moment = require('moment');






///admin login page rendering 
const adminDashbordPage = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find();
        const orders = await Oder.find({status:"delivered"});
        const catogary=await Catogary.find()
        const users= await User.find()



        const latestOrders = await Oder.find().sort({ createdOn: -1 }).limit(5);
       




        const productCount = products.length;
        const orderCount = orders.length;
        const catogaryCount=catogary.length
      
        const totalRevenue = orders.reduce((total, order) => total + order.totalPrice, 0);

     
      




        //-------------------this is for the sales graph -----
        const monthlySales = await Oder.aggregate([
            {
                $match: {
                    status: "delivered", // Filter by status
                },
            },
            {
                $group: {
                    _id: {
                        $month: '$createdOn',
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: {
                    '_id': 1,
                },
            },
        ]);
        const monthlySalesArray = Array.from({ length: 12 }, (_, index) => {
            const monthData = monthlySales.find((item) => item._id === index + 1);
            return monthData ? monthData.count : 0;
        });

        //-------------------this is for the sales graph -end ----







        ///----------this is for the product data------
        const productsPerMonth = Array(12).fill(0);

        // Iterate through each product
        products.forEach(product => {
          // Extract month from the createdAt timestamp
          const creationMonth = product.createdAt.getMonth(); // JavaScript months are 0-indexed
    
          // Increment the count for the corresponding month
          productsPerMonth[creationMonth]++;
        });
        ///----------this is for the product data--end----







        res.render('dashbord', { totalRevenue, orderCount, productCount,catogaryCount ,monthlySalesArray,productsPerMonth,latestOrders});

    } catch (error) {
        console.log('Error happened in admin controller at adminLoginPage function ', error);
    }
});
//-----------------------------------------------------








//lod adminlogin page -------------------------------
const loadLogin = asyncHandler(async (req, res) => {
    try {

        res.render('login')

    } catch (error) {
        console.log('Error hapence in admin conroller at loadLogin function ', error);
    }

})
//------------------------------------------------------








//admin login vrification with data---------------------------------------------------
const adminVerifyLogin = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email);

        const findAdmin = await User.findOne({ email, isAdmin: '1' });
        console.log('admin data :', findAdmin);

        if (findAdmin && await findAdmin.isPasswordMatched(password)) {

            req.session.Admin = true;

            res.redirect('/api/admin/')
        } else {
            res.redirect('/api/admin/login')
        }
    } catch (error) {
        console.log('Error hapence in admin conroller at adminVerifyLogin function ', error);
    }
})
//-----------------------------------------------------------------








//aadmin logout funxtion ---------------------------------------
const logout = asyncHandler(async (req, res) => {
    try {
        req.session.Admin = null;
        res.redirect('/api/admin')

    } catch (error) {
        console.log('Error hapence in admin conroller at logout function ', error);
    }
})
//---------------------------------------------------------------









//rendering user page and show all user detailes------------------
const users = asyncHandler(async (req, res) => {
    try {
       
        const users = await User.find({ isAdmin: { $ne: "1" } });
        
       





        const itemsperpage = 8;
        const currentpage = parseInt(req.query.page) || 1;
        const startindex = (currentpage - 1) * itemsperpage;
        const endindex = startindex + itemsperpage;
        const totalpages = Math.ceil(users.length / 8);
        const currentproduct = users.slice(startindex,endindex);
       
    
       

        res.render('users', { users: currentproduct, totalpages, currentpage})


    } catch (error) {
        console.log('Error hapence in admin conroller at users function ', error);
    }
})

//---------------------------------------------------------------









//blok the user --------------------------
const blokeUser = asyncHandler(async (req, res) => {
    try {
        const id = req.query.id;
        console.log(id, 'user id in bloked user');

        const blokedUser = await User.findByIdAndUpdate(id, {
            isBlocked: true
        }, { new: true });

        if (blokedUser) {
            // req.session.userBloked = true;
            // req.session.isBlocked = true;
           
            res.redirect('/api/admin/users');
        }
    } catch (error) {
        console.log('Error happens in admin controller at blokeUser function', error);
    }
});
//--------------------------------------------------








//unbloking a user ---------------------------------------
const unBlokeUser = asyncHandler(async (req, res) => {
    try {
        const id = req.query.id;
        console.log(id, 'user id in unbloked user');

        const unBlokedUser = await User.findByIdAndUpdate(id, {
            isBlocked: false,
        }, { new: true });

        if (unBlokedUser) {
            req.session.userBloked = false;
            req.session.blockedMessage = "User is unblocked by admin."; 
            console.log('User is unblocked by admin', unBlokedUser);
            res.redirect('/api/admin/users');
        }
    } catch (error) {
        console.log('Error happens in admin controller at unBlokeUser function', error);
    }
});
//------------------------------------------------------------------------







module.exports = { 
    adminDashbordPage, 
    loadLogin,
    adminVerifyLogin,
     logout, 
    users,
     blokeUser,
     unBlokeUser
     } 


