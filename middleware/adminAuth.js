const asyncHandler=require('express-async-handler')

const isAdminAuth=asyncHandler(async(req,res,next)=>{
    try {
        if(req.session.Admin){
            next()
        }else{
            res.redirect('/api/admin/login')
        }
        
    } catch (error) {
        console.log('error hapends in isAdminAuth middleware ',error);
    }
})


module.exports={
    isAdminAuth
}