const asyncHandler = require('express-async-handler');
const User = require('../models/userModel')
const Product=require('../models/productModel')
const nodemailer=require("nodemailer");
const bcrypt=require('bcrypt')
const mongoosePaginate = require('mongoose-paginate-v2');
const { use } = require('passport');

//load the index page ----------------------------
const loadIndex = asyncHandler(async (req, res) => {
    try {
        const user = req.session.user;
       const product=await Product.find()
      req.session.Product=product
   

      
        res.render('index', { user, product });
        
       
    } catch (error) {
        console.log('Error happens in userController loadIndex function:', error);
    }
});
//-----------------------------------------------




//---------load the sign in page --------------------------
const loadSignIn = asyncHandler(async (req, res) => {
    try {
      
        res.render('loginPage')
    } catch (error) {
        console.log('Error hapents in userControler loadSignIn function :', error);
    }
})
//------------------------------------------------------



//--load the sign up page ---------
const loadSignUp = asyncHandler(async (req, res) => {
    try {
        res.render('signUpPage', { message: "", errMessage: ""})
    } catch (error) {
        console.log('Error hapents in userControler loadSignup function :', error);
    }
})
//------------------------------------------


//genarte a otp--------------------------------
function generateotp() {

    var digits = '1234567890';
    var otp = ''
    for (i = 0; i < 6; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
}
//---------------------------------------------------------



//--save the user data throw post methord in signup -----
const registerUser = asyncHandler(async (req, res) => {
    try {
        const {email}=req.body;   
        const findUser=await User.findOne({email})
        if(findUser){
            //pass a error messAge
        }else{
            const otp = generateotp();
            const transporter = nodemailer.createTransport({
                service:"gmail",
                port:587,
                secure:false,
                requireTLS:true,
                    auth: {                     
                        user:process.env.AUTH_EMAIL,
                        pass:process.env.AUTH_PASS
                    },
                  });
                  const info = await transporter.sendMail({
                    from: process.env.AUTH_EMAIL, // sender address
                    to: email, // list of receivers
                    subject: "Verify Your Account  ✔", // Subject line
                    text: `Your OTP is : ${otp}`, // plain text body
                    html: `<b>  <h4 >Your OTP  ${otp}</h4>    <br>  <a href="/api/user/emailOTP/">Click here</a></b>`, // html body
                  });
                  if(info){
                    req.session.userOTP=otp;
                    req.session.userData=req.body
                    res.render('emailOTP')
                    console.log("Message sent: %s", info.messageId);        
                  }else{
                    res.json("email eroor")
                  }
        }
    } catch (error) {
        console.log('Error hapents in userControler registeruser function :', error);
    }
})

//------------------------------------------------------------------



//user login-------------------------------------------------- 
const userLogin= asyncHandler(async(req,res)=>{
    try {
        const {email ,password}=req.body;
        //find the perticular user is exist or not
        const findUser=await User.findOne({email})
        if(findUser && await findUser.isPasswordMatched(password)){
            req.session.user=findUser._id
            req.session.isAuth= findUser._id;
            
            res.redirect('/api/user')
     
        }else{
            req.flash('error', 'Invalid User')
            res.redirect('/api/user/login')
        }     
    } catch (error) {
        console.log('Error hapents in userControler userLogin function :', error);
        res.json({mes:"errorr in user loging cactch"})
    }
})  
//-------------------------------------------



//user logout -------------------------------
const userLogout = async (req, res) => {
    try {
        req.session.user = null
        req.session.isBlocked = false; // Clear the blocked message
        req.session.blockedMessage = "You are logged out."; // Set a message for logout
        res.redirect('/api/user')

    } catch (error) {
        console.log('Error happens in userControler userLogout function:', error);
        res.json({ mes: "error in user logout catch" });
    }
}
//-------------------------------------------





 const mobileOTP=asyncHandler (async(req,res)=>{
    try {
        res.render('mobileOTP')
        
    } catch (error) {
        console.log('Error hapents in userControler otpVerify function :', error);
    }
 })



 // user otp enter cjeking if its true render home else error mesage

 const emailVerified=async(req,res)=>{
    try {
     

        const { first,second,third,fourth,fifth,six }=req.body
        const enteredOTP=first + second+ third+ fourth+ fifth+ six;

      

       
       
        

        if (enteredOTP ===  req.session.userOTP) {
            // OTPs match, user is valid
           
           
            const user=req.session.userData;
           const saveUserData= new User({
            username:user.username,
            email:user.email,
            mobile:user.mobile,
            password:user.password

           }) 
            await saveUserData.save();
           console.log(saveUserData);

           res.redirect('/api/user')

        }else{
            console.log('error in otp ');
            req.flash('error', 'No Match OTP');
            // load error page here
        }
        
    } catch (error) {
        console.log('Error hapents in userControler emaiVerified  function :', error);
        
    }
 }
//-----------------------------------------------------



//------rendering the forgote assword page ------------------------


const forgotPsdPage=asyncHandler(async(req,res)=>{
    try {
        res.render('forgotPassword')
        
    } catch (error) {
        console.log('Error hapents in userControler forgotPsdPage  function :', error);
        
    }
})

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
                res.render('forgotPsdOTP');
                console.log("Message sent: %s", info.messageId);
            } else {
                res.json("email error");
            }
        } else {
         
            req.flash('error', 'User not found');
            res.redirect('/api/user/forgotPassword'); 
        }
    } catch (error) {
        console.log('Error happens in userControler forgotEmailValid function:', error);
    }
});


//------cheking the re entedred email is aledy exist if exist chek otp is valid

const forgotPsdOTP=asyncHandler(async(req,res)=>{
    try {
       
        const { first,second,third,fourth,fifth,six }=req.body
        const enteredOTP=first + second+ third+ fourth+ fifth+ six;

        console.log('otp entered by user :',enteredOTP);

       
       
        

        if (enteredOTP ===  req.session.forgotOTP) {
           
            res.render('resetPassword')
        }else{
            console.log('error in otp ');
            // load error page here
        }
        
        
    } catch (error) {
        console.log('Error hapents in userControler forgotPsdOTP  function :', error);
        
    }
})


const updatePassword=asyncHandler(async(req,res)=>{
    try {
        const email=req.session.forgotEmail
        const user=await User.findOne({email})
       

        if(user){
            const salt=await bcrypt.genSaltSync(10);
            const pass=await bcrypt.hash(req.body.password,salt)
            const updateUser=await User.findByIdAndUpdate(user._id,{
                password:pass
            },{new:true})
            

            res.redirect('/api/user')
        }
    } catch (error) {
        console.log('Error hapents in userControler updatePassword  function :', error);
        
    }
})



module.exports = { loadIndex, loadSignIn, loadSignUp, registerUser , userLogin , userLogout  ,mobileOTP ,emailVerified ,forgotPsdPage,forgotEmailValid,forgotPsdOTP,updatePassword}