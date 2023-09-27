const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const mongoosePaginate = require("mongoose-paginate-v2");
const { use } = require("passport");
const Oder=require('../models/oderModel')
const Banner=require('../models/bannerModel')
const Catogary=require('../models/catogaryModel')

















//--------------hasinthe password------------------

const generateHashedPassword = async (password) => {
    const saltRounds = 10; // Number of salt rounds
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  };
//----------------------------------



//load the index page ----------------------------
const loadIndex = asyncHandler(async (req, res) => {
    try {
        const user = req.session.user;
        if(user){
            const womens=await Product.find({catogary:" Womon's Clothing"})
          
            const catogary= await Catogary.find()
            const userdata=await User.findById(user)
            const product = await Product.find().limit(9);
            const banner= await Banner.find()
            const pr = product.status == true;
            req.session.Product = product;
            res.render("index", { user:userdata, product ,banner,catogary,womens});

        }else{
            const womens=await Product.find({catogary:" Womon's Clothing"})
            
            const catogary= await Catogary.find()
            const product = await Product.find().limit(9);
            const banner= await Banner.find()
            const pr = product.status == true;
            req.session.Product = product;
            res.render("index", { user, product ,banner, catogary,womens});
        }
       
    } catch (error) {
        console.log("Error happens in userController loadIndex function:", error);
    }
});
//-----------------------------------------------






//---------load the sign in page --------------------------
const loadSignIn = asyncHandler(async (req, res) => {
    try {
        res.render("loginPage");
    } catch (error) {
        console.log("Error hapents in userControler loadSignIn function :", error);
    }
});
//------------------------------------------------------






//--load the sign up page ---------
const loadSignUp = asyncHandler(async (req, res) => {
    try {
        res.render("signUpPage", { message: "", errMessage: "" });
    } catch (error) {
        console.log("Error hapents in userControler loadSignup function :", error);
    }
});
//------------------------------------------






//genarte a otp--------------------------------
function generateotp() {
    var digits = "1234567890";
    var otp = "";
    for (i = 0; i < 6; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
}
//---------------------------------------------------------





//--save the user data throw post methord in signup -----
const registerUser = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;
        const findUser = await User.findOne({ email });
        if (findUser) {
            //pass a error messAge
        } else {
            const otp = generateotp();
            const transporter = nodemailer.createTransport({
                service: "gmail",
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user: process.env.AUTH_EMAIL,
                    pass: process.env.AUTH_PASS,
                },
            });
            const info = await transporter.sendMail({
                from: process.env.AUTH_EMAIL, // sender address
                to: email, // list of receivers
                subject: "Verify Your Account  ✔", // Subject line
                text: `Your OTP is : ${otp}`, // plain text body
                html: `<b>  <h4 >Your OTP  ${otp}</h4>    <br>  <a href="/api/user/emailOTP/">Click here</a></b>`, // html body
            });
            if (info) {
                req.session.userOTP = otp;
                req.session.userData = req.body;
                res.render("emailOTP");
                console.log("Message sent: %s", info.messageId);
            } else {
                res.json("email eroor");
            }
        }
    } catch (error) {
        console.log(
            "Error hapents in userControler registeruser function :",
            error
        );
    }
});

//------------------------------------------------------------------






//user login--------------------------------------------------
const userLogin = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        const findUser = await User.findOne({ email });
        if (findUser && (await findUser.isPasswordMatched(password))) {
            req.session.user = findUser._id;
            req.session.isAuth = findUser._id;
            res.redirect("/api/user");
        } else {
            console.log('error in login userr');
            res.redirect("/api/user/login");
        }
    } catch (error) {
        console.log("Error hapents in userControler userLogin function :", error);
        res.json({ mes: "errorr in user loging cactch" });
    }
});
//------------------------------------------- ---------------------------






//user logout -------------------------------
const userLogout = async (req, res) => {
    try {
        req.session.destroy()
        
        res.redirect("/api/user");
    } catch (error) {
        console.log("Error happens in userControler userLogout function:", error);
       
    }
};
//-------------------------------------------






//rendering th otp page ---------------------------------
const mobileOTP = asyncHandler(async (req, res) => {
    try {
        res.render("mobileOTP");
    } catch (error) {
        console.log("Error hapents in userControler otpVerify function :", error);
    }
});
//-----------------------------------------------------






// user otp enter cjeking if its true render home else error mesage-------------
const emailVerified = async (req, res) => {
    try {
        const { first, second, third, fourth, fifth, six } = req.body;
        const enteredOTP = first + second + third + fourth + fifth + six;
        if (enteredOTP === req.session.userOTP) {
            const user = req.session.userData;

            const hashedPassword = await generateHashedPassword(user.password);
            const saveUserData = new User({
                username: user.username,
                email: user.email,
                mobile: user.mobile,
                password: hashedPassword,
            });
            await saveUserData.save();

            req.session.user=saveUserData._id
           
            res.redirect("/api/user");
        } else {
          
            req.flash("error", "No Match OTP");
        }
    } catch (error) {
        console.log(
            "Error hapents in userControler emaiVerified  function :",
            error
        );
    }
};
//-----------------------------------------------------






//------rendering the forgote assword page ------------------------
const forgotPsdPage = asyncHandler(async (req, res) => {
    try {
        res.render("forgotPassword");
    } catch (error) {
        console.log(
            "Error hapents in userControler forgotPsdPage  function :",
            error
        );
    }
});
//--------------------------------------------






//---chech the email is valid and send an email to it ---------------
const forgotEmailValid = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;
        const findUser = await User.findOne({ email });
        if (findUser) {
            const otp = generateotp();
            const transporter = nodemailer.createTransport({
                service: "gmail",
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user: process.env.AUTH_EMAIL,
                    pass: process.env.AUTH_PASS,
                },
            });
            const info = await transporter.sendMail({
                from: process.env.AUTH_EMAIL,
                to: email,
                subject: "Verify Your Account  ✔",
                text: `Your OTP is : ${otp}`,
                html: `<b>  <h4 >Your OTP  ${otp}</h4>    <br>  <a href="/api/user/emailOTP/">Click here</a></b>`,
            });
            if (info) {
                req.session.forgotOTP = otp;
                req.session.forgotEmail = req.body.email;
                res.render("forgotPsdOTP");
                console.log("Message sent: %s", info.messageId);
            } else {
                res.json("email error");
            }
        } else {
            req.flash("error", "User not found");
            res.redirect("/api/user/forgotPassword");
        }
    } catch (error) {
        console.log(
            "Error happens in userControler forgotEmailValid function:",
            error
        );
    }
});
//---------------------------------------------------------







//------cheking the re entedred email is aledy exist if exist chek otp is valid

const forgotPsdOTP = asyncHandler(async (req, res) => {
    try {
        const { first, second, third, fourth, fifth, six } = req.body;
        const enteredOTP = first + second + third + fourth + fifth + six;
        console.log("otp entered by user :", enteredOTP);
        if (enteredOTP === req.session.forgotOTP) {
            res.render("resetPassword");
        } else {
            console.log("error in otp ");
        }
    } catch (error) {
        console.log(
            "Error hapents in userControler forgotPsdOTP  function :",
            error
        );
    }
});
//---------------------------------------------------------------






//------------updating password -------------------------------
const updatePassword = asyncHandler(async (req, res) => {
    try {
        const email = req.session.forgotEmail;
        const user = await User.findOne({ email });
        if (user) {
            const hashedPassword = await generateHashedPassword(req.body.password);
            const updateUser = await User.findByIdAndUpdate(
                user._id,
                {
                    password: hashedPassword,
                },
                { new: true }
            );


            res.redirect("/api/user");
        }
    } catch (error) {
        console.log(
            "Error hapents in userControler updatePassword  function :",
            error
        );
    }
});
//------------------------------------------------------------






//-------------user prfile rendering----------------------
const userProfile = asyncHandler(async (req, res) => {
    try {
        const id = req.session.user;
        const user = await User.findById(id);
        const order = await Oder.find({ userId: id }).sort({ date: -1 });


        // console.log('this is the orders od user',);
        res.render("userProfile", { user,order });
    } catch (error) {
        console.log(
            "Error hapents in userControler userProfile  function :",
            error
        );
    }
});
//------------------------------------------------------------








//ading a new adress to the user-----------------------------------
const addAddress = asyncHandler(async (req, res) => {
    try {
        const {
            fullName,
            mobile,
            region,
            pinCode,
            addressLine,
            areaStreet,
            ladmark,
            townCity,
            state,
            addressType,
        } = req.body;
        const id = req.session.user;
        const user = await User.findById(id);
        const newAddress = {
            fullName,
            mobile,
            region,
            pinCode,
            addressLine,
            areaStreet,
            ladmark,
            townCity,
            state,
            addressType,
            main: false,
        };
        if (user.address.length === 0) {
            newAddress.main = true;
        }
        user.address.push(newAddress);
        await user.save();
        console.log("Address added to user:", user);
        res.redirect("/api/user/profile");
    } catch (error) {
        console.log("Error happens in userControler addAddress function:", error);
    }
});

//-------------------------------------------------------------------





//---------------editing the curent adress--------------------------------
const loadEditAddress = asyncHandler(async (req, res) => {
    try {
        const id = req.query.id;
        const userId = req.session.user;
        const user = await User.findById(userId);
        const address = user.address.id(id);
        res.render("editAddress", { user, address });
    } catch (error) {
        console.log(
            "Error hapents in userControler loadEditAdress function:",
            error
        );
    }
});

//----------------------------------------------------------





// editing the corent adress -----------------------------------------------
const updateEditedAddress = asyncHandler(async (req, res) => {
    try {
        const userId = req.session.user;
        const {
            fullName,
            mobile,
            region,
            pinCode,
            addressLine,
            areaStreet,
            ladmark,
            townCity,
            state,
            adressType,
            id,
        } = req.body;
        const user = await User.findById(userId);
        if (user) {
            const updatedAddress = user.address.id(id);
            console.log(updatedAddress);
            if (updatedAddress) {
                updatedAddress.fullName = fullName;
                updatedAddress.mobile = mobile;
                updatedAddress.region = region;
                updatedAddress.pinCode = pinCode;
                updatedAddress.addressLine = addressLine;
                updatedAddress.areaStreet = areaStreet;
                updatedAddress.ladmark = ladmark;
                updatedAddress.townCity = townCity;
                updatedAddress.state = state;
                updatedAddress.adressType = adressType;
                await user.save();

                res.redirect("/api/user/profile");
            } else {
                console.log("adress not found ");
            }
        }
    } catch (error) {
        console.log(
            "Error hapents in userControler updateEditedAddress function:",
            error
        );
    }                                      
});             
//------------------------------------------------------






//------------ddelete a spesific address=----------------------------------------

const deleteAddress = asyncHandler(async (req, res) => {
    try {
        const id = req.query.id;
        const userId = req.session.user;

        const deleteAdd = await User.findOneAndUpdate(
            { _id: userId },
            {
                $pull: { address: { _id: id } },
            },
            { new: true }
        );
        console.log("this that deleted address", deleteAdd);
        res.redirect("/api/user/profile");
    } catch (error) {
        console.log(
            "Error hapents in userControler udeletedAddress function:",
            error
        );
    }
});

//---------------------------------------------------------------------------------






//----------------rendering-edit user profile------------------------------------

const editProfile = asyncHandler(async (req, res) => {
    try {
        const id = req.query.id;
        const user = await User.findById(id);
        console.log("user is ", user);
        res.render("editProfile", { user });
    } catch (error) {
        console.log("Error hapents in userControler editProfile function:", error);
    }
});
//------------------------------------------------






// -----------------------updating the user profile data -----------------------------

const updateProfile = asyncHandler(async (req, res) => {
    try {
        const { id, username, email, mobile } = req.body;

        const user = await User.findByIdAndUpdate(id);
        //cheking that anything aleary exist--
        const alreadyExist = await User.find({
            $and: [
                { _id: { $ne: user._id } }, // not equal to the current user
                { $or: [{ username }, { email }] }, // Check for the same username or email
            ],
        });

        if (alreadyExist.length == 0) {
            user.username = username;
            user.email = email;
            user.mobile = mobile;
            const updatedUser = await user.save();

            res.redirect("/api/user/profile");
        } else {
            console.log("user is alredy exist ");
        }
    } catch (error) {
        console.log(
            "Error hapents in userControler updateProfile function:",
            error
        );
    }
});

//-------------------------------------------------------------------------------------------





///--------------------add prfile pciture-------------------------
const addProficPic = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;
        const image = req.file.filename;
       
        const user = await User.findByIdAndUpdate(
            id,
            {
                image: image,
            },
            { new: true }
        );
      
        res.redirect("/api/user/profile");
    } catch (error) {
        console.log(
            "Error hapents in userControler addProfilepic function:",
            error
        );
    }
});



////---------------googler auth=----------------

const googleAuth=asyncHandler(async(req,res)=>{
  


        try {
           
            const findUser = await User.findOne({ email: req.user.email });
            if (findUser) {
                req.session.user=findUser._id
                 
            }else{
                const user=req.user
                const saveUserData = new User({
                    username: user.given_name,
                    email: user.email,
                    image:user.picture,
                    password:user.sub,
                    isGoogle:true
                });
                const us=await saveUserData.save();
                req.session.user=us._id
               
            }
          
            res.redirect('/api/user')
            
        } catch (error) {
            console.log('errro hapence in the google login route ',error);
        }
    
})

//--------------------------------------








module.exports = {
    loadIndex,
    loadSignIn,
    loadSignUp,
    registerUser,
    userLogin,
    userLogout,
    mobileOTP,
    emailVerified,
    forgotPsdPage,
    forgotEmailValid,
    forgotPsdOTP,
    updatePassword,
    userProfile,
    addAddress,
    loadEditAddress,
    updateEditedAddress,
    deleteAddress,
    editProfile,
    updateProfile,
    addProficPic,
    googleAuth,
   
};
