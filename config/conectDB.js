const mongoose= require('mongoose');

const dbConnect= async()=>{
    try {
        mongoose.connect(process.env.MONGO_URL)
        console.log('db connected');
        
    } catch (error) {
        console.log('mongo db connetion error',error);
        
    }

};
              
module.exports={dbConnect}