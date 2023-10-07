const asyncHandler=require('express-async-handler')
const Blog=require('../models/blogModel')
const User=require('../models/userModel')



//----------rendering blog pag ein user side ------------
const blog= asyncHandler(async(req,res)=>{
    try {
        const blog= await Blog.find()
        const userId=req.session.user
        const user=await User.findById(userId)

        const itemsperpage = 8;
        const currentpage = parseInt(req.query.page) || 1;
        const startindex = (currentpage - 1) * itemsperpage;
        const endindex = startindex + itemsperpage;
        const totalpages = Math.ceil(blog.length / 8);
        const currentproduct = blog.slice(startindex,endindex);

        

        res.render('blog',{blog:currentproduct, totalpages,currentpage,user})


      
    } catch (error) {
        console.log('ERROR Happence in the blog ctrl in the funtion blog',error);
    }
})
//========================================






//=========rendering a sinngle page in user side--------------
const singleBlog=asyncHandler(async(req,res)=>{
    try {
const id= req.query.id;
const blog= await Blog.findById(id)


        res.render('singleBlog',{blog})
    } catch (error) {
        console.log('ERROR Happence in the blog ctrl in the funtion singleBlog',error);
        
    }
})
//--------------------------------------






//------------rendering blog page in admin side------------
const adminBlog=asyncHandler(async(req,res)=>{
    try {

const blog=await Blog.find()

console.log('this is blog data ',blog);

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
        console.log(req.body,"this is req.body in create blog",req.file.filename);
        const b=req.body

        const exist= await Blog.findOne({title:b.title})
        if(!exist){
            console.log('here');
            const blog= new Blog({
                title:b.title,
                content:b.content,
                author:b.author,
                createdAt:Date.now(),
                image:req.file.filename
            })
            
            
              const a= await blog.save()
              console.log(a,"this is the saved dat od blog in create blog");

        

        res.redirect('/api/admin/blog')

        }else{
            res.redirect('/api/admin/loadCreateBlog')
        }

       

  


        
    } catch (error) {
        console.log('ERROR Happence in the blog ctrl in the funtion createBlog',error);
        
    }
})
//----------------------------------------------------------------------







//------------------------------rednering edit bog page with data ----------------------------------------
const loadEditBlog=asyncHandler(async(req,res)=>{
    try {
        const id = req.query.id
        const blog= await Blog.findById(id)

        if(blog){
            res.render('editBlog',{blog})
        }
        
    } catch (error) {
        console.log('ERROR Happence in the blog ctrl in the funtion loadEditBlog',error);
        
    }
})
//----------------------------------------------------------------------








//---------------------------------update a blog -----------------------------------
const updateBlog=asyncHandler(async(req,res)=>{
    try {

        console.log(req.body);

        const img = req.file ? req.file.filename : null;
        if(img){
            const id= req.body.id;
            const b=req.body
            const blog= await Blog.findByIdAndUpdate(id,{
                title:b.title,
                content:b.content,
                author:b.author,
                image:req.file.filename
            })
            if(blog){
                res.redirect('/api/admin/blog')
            }else{
                res.redirect(`/api/admin/loadEditBlog?id=${id}`)
            }

        }else{
            const id= req.body.id;
            const b=req.body
           
            const blog= await Blog.findByIdAndUpdate(id,{
                title:b.title,
                content:b.content,
                author:b.author,
                
            })
            if(blog){
                res.redirect('/api/admin/blog')
            }else{
                res.redirect(`/api/admin/loadEditBlog?id=${id}`)
            }

            
        }

     

    



        
    } catch (error) {
        console.log('ERROR Happence in the blog ctrl in the funtion updateBlog',error);
        
    }
})
//----------------------------------------------------------------------









//--------------------------ddlete a blog--------------------------------------------
const deleteBlog=asyncHandler(async(req,res)=>{
    try {

        const id=req.query.id;
        const blog= await Blog.findByIdAndDelete(id)
        

        if(blog){
            res.redirect('/api/admin/blog')
        }
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