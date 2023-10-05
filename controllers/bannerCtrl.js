const Banner=require('../models/bannerModel')
const asyncHandler=require('express-async-handler')




///-------------------------rendering baner-----------------------------
const banner=asyncHandler(async(req,res)=>{
    try {
        const banner= await Banner.find()


        const itemsperpage = 2;
        const currentpage = parseInt(req.query.page) || 1;
        const startindex = (currentpage - 1) * itemsperpage;
        const endindex = startindex + itemsperpage;
        const totalpages = Math.ceil(banner.length / 2);
        const currentproduct = banner.slice(startindex,endindex);
        res.render('banner',{banner:currentproduct,totalpages,currentpage,})
        
    } catch (error) {
        console.log('Error from the banner ctrl in the funtion banner',error);
    }
})
//-------------------------------------------------------------------





//----------------------rendering the create banner page---------------------------
const addNewBanner=asyncHandler(async(req,res)=>{
    try {
        res.render('addBanner')
    } catch (error) {
        console.log('Error from the banner ctrl in the funtion addNewBanner',error);
        
    }
})

//-----------------------------------------









//-----------------create a banner------------------------------------
const createBanner=asyncHandler(async(req,res)=>{
    try {
   
        const {title,discription,link}=req.body
        console.log('this is req.body',req.body);
         const allreadyExist= await Banner.findOne({title})
        if(!allreadyExist){

            const banner= new Banner({
                image:req.file.filename,
                title,
                discription,
                date:Date.now(),
                link
            })

          const a=  await banner.save()
          console.log('this is banner',a);
          res.redirect('/api/admin/banner')

        }
        






    } catch (error) {
        console.log('Error from the banner ctrl in the funtion createBanner',error);
        
    }
})

//--------------------------------------------------------------------







//-------------------------------editt banner------------------------------------
const editBanner=asyncHandler(async(req,res)=>{
    try {
        const id =req.query.id
        const banner= await Banner.findById(id)

        if(banner){
            res.render('editBanner',{banner})
        }
       
        
    } catch (error) {
        console.log('Error from the banner ctrl in the funtion editBanner',error);
        
    }
})
//-------------------------------------------------------------------








//-----------------------update baner --------------------------
const updateBanner=asyncHandler(async(req,res)=>{
    try {



        const {title,discription,link,id}=req.body

        const img = req.file ? req.file.filename : null; 

        if(img){
            const update= await Banner.findByIdAndUpdate(id,{
                title,
                discription,
                link,
                image:req.file.filename
            })
            console.log('tis is updated banner',update);
            res.redirect('/api/admin/banner')

        }else{
            const update= await Banner.findByIdAndUpdate(id,{
                title,
                discription,
                link,
        })
        res.redirect('/api/admin/banner')
    }
   







    } catch (error) {
        console.log('Error from the banner ctrl in the funtion updateBanner',error);
        
    }
})
//--------------------------------------------------------------







//----------------------------delete baner---------------------------------------
const deleteBanner=asyncHandler(async(req,res)=>{
    try {
        
const id = req.query.id


const banner= await Banner.findByIdAndDelete(id)

console.log('this is the baner',banner);
if(banner){
    res.redirect('/api/admin/banner')

}



    } catch (error) {
        console.log('Error from the banner ctrl in the funtion updateBanner',error);
        
    }
})

//-------------------------------------------------------------------




module.exports={
    banner,
    addNewBanner,
    createBanner,
    editBanner,
    updateBanner,
    deleteBanner
}