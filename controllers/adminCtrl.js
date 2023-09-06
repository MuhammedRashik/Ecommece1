const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')


///admin login page rendering 
const adminDashbordPage = asyncHandler(async (req, res) => {
    try {
        res.render('dashbord')

    } catch (error) {
        console.log('Error hapence in admin conroller at adminLoginpage function ', error);
    }
})
///-----------------------------------------------------------




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

            res.render('dashbord')
        } else {
            res.redirect('/api/admin/')
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
        // console.log('user data :', users[0]);
        req.session.allUsers = users
        res.render('users', { users: users })


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
            req.session.userBloked = true;
            req.session.isBlocked = true;
            console.log('User is blocked by admin', blokedUser);
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





module.exports = { adminDashbordPage, loadLogin, adminVerifyLogin, logout, users, blokeUser, unBlokeUser }