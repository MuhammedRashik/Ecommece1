const asyncHandler=require('express-async-handler')

const aboutpage= asyncHandler(async(req,res)=>{
    try {
        res.render('about')
        
    } catch (error) {
        console.log('Error Happence in th about Ctrl in;; the funtion aboutpage',error);
    }
})



module.exports={
    aboutpage
}