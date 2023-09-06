const isAuth = async(req,res,next)=>{
    try {
       if(req.session.isAuth){
          next()
       }
       else{
          res.redirect('/api/user/');
       }
    } catch (error) {
       console.log(error.message)
    }
 }
 
 const setUserVariable = (req, res, next) => {
   res.locals.user = req.session.user || false; // Set 'user' based on the session
   next();
};

const isBloked=async(req,res,next)=>{
   if(req.session.userBloked){
      req.session.blockedMessage = "You are blocked by the admin.";
      res.redirect('/api/user/logout')
      // res.send('hai')
      // res.redirect('/api/user/login')
   }else{
      next()
   }
}

 
 
 module.exports = {isAuth, setUserVariable,isBloked}

