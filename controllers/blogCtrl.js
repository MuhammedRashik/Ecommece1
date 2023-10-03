const asyncHandler=require('express-async-handler')
const Blog=require('../models/blogModel')
//----------rendering blog pag ein user side ------------
const blog= asyncHandler(async(req,res)=>{
    try {
        res.render('blog')
        
    } catch (error) {
        console.log('ERROR Happence in the blog ctrl in the funtion blog',error);
    }
})
//========================================


//=========rendering a sinngle page in user side--------------
const singleBlog=asyncHandler(async(req,res)=>{
    try {
        res.render('singleBlog')
    } catch (error) {
        console.log('ERROR Happence in the blog ctrl in the funtion singleBlog',error);
        
    }
})
//--------------------------------------




//------------rendering blog page in admin side------------
const adminBlog=asyncHandler(async(req,res)=>{
    try {

const blog=await Blog.find()


        res.render('blog',{blog})
    } catch (error) {
        console.log('ERROR Happence in the blog ctrl in the funtion adminBlog',error);
        
    }
})
//-------------------------------------------------



//-----------------------------rendering create blog pafe-----------------------------------------
const loadCreateBlog=asyncHandler(async(req,res)=>{
    try {
        res.render('addBlog')
    } catch (error) {
        console.log('ERROR Happence in the blog ctrl in the funtion loadCreateBlog',error);
        
    }
})
//----------------------------------------------------------------------




//----------------------------create  a blog ------------------------------------------
const createBlog=asyncHandler(async(req,res)=>{
    try {
        console.log(req.body,"this is req.body in create blog");
        const b=req.body

        const exist= await Blog.find({title:b.title})

        if(!exist){
const blog= new Blog({
    title:b.title,
    content:b.content,
    author:b.author,
    image:req.file.filename
})


   await blog.save()

        }

        res.redirect('/api/admin/blog')


        
    } catch (error) {
        console.log('ERROR Happence in the blog ctrl in the funtion createBlog',error);
        
    }
})
//----------------------------------------------------------------------





//------------------------------rednering edit bog page with data ----------------------------------------
const loadEditBlog=asyncHandler(async(req,res)=>{
    try {
        
    } catch (error) {
        console.log('ERROR Happence in the blog ctrl in the funtion loadEditBlog',error);
        
    }
})
//----------------------------------------------------------------------





//---------------------------------update a blog -----------------------------------
const updateBlog=asyncHandler(async(req,res)=>{
    try {
        
    } catch (error) {
        console.log('ERROR Happence in the blog ctrl in the funtion updateBlog',error);
        
    }
})
//----------------------------------------------------------------------






//--------------------------ddlete a blog--------------------------------------------
const deleteBlog=asyncHandler(async(req,res)=>{
    try {
        
    } catch (error) {
        console.log('ERROR Happence in the blog ctrl in the funtion deleteBlog',error);

    }
})
//----------------------------------------------------------------------










module.exports={
    blog,
    singleBlog,
    adminBlog,
    createBlog,
    deleteBlog,
    loadCreateBlog,
    loadEditBlog,
    updateBlog

}