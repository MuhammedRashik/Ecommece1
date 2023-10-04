const { adminVerifyLogin } = require('../controllers/adminCtrl')
const User=require('../models/userModel')





const isLogged=((req,res,next)=>{
   
    if(req.session.user){
      
      User.findById({_id:req.session.user}).lean()
        .then((data)=>{
         
            if(data.isBlocked==false){
              next()
            }else{
                res.redirect('/api/user/login')
            }
        })
    }else{
        res.redirect('/api/user/login')
    }
})

const adminLoggedIn=((req,res,next)=>{
    if(req.session.adminLoggedIn==true ){
        next()
    }else{
        res.redirect('/admin/admin-login')
    }
})

module.exports={
    isLogged,
    adminLoggedIn
}
