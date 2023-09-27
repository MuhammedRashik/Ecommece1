const express=require('express');
const bodyParser=require('body-parser')
const path =require('path')
const cookieParser=require('cookie-parser')
const PORT=process.env.PORT || 5000
const morgan=require('morgan');
const flash = require('connect-flash');
const session = require('express-session');
const nocache=require('nocache')
const dotenv=require('dotenv').config()
const passport=require('passport')

const { dbConnect } = require('./config/conectDB');
const mongodbSession=require('connect-mongodb-session')(session)
const store= new mongodbSession({
    uri:process.env.MONGO_URL,
    collection:"SessionDB",
})



dbConnect()



const app=express();



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname,'public')));
app.use(morgan("dev"))
app.use(flash());


app.use(session({
      secret:process.env.SESSION_SECRET_KEY,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 72 * 60 * 60 * 1000, // Session expires in 72 hours
        httpOnly: true,
      },
      store:store
    })
  );
  app.use(nocache())
  app.use(passport.initialize())
  app.use(passport.session())

 
//-----------------user router --------------------
const userRouter=require('./routes/userRouter')
app.use('/api/user',userRouter)
//------------------------------------------------

//--------admin router------------------------------
const adminRoter=require('./routes/adminRouter');
app.use('/api/admin',adminRoter)
 //-------------------------------------------------






app.listen(PORT,()=>console.log(`server is runnging at the port ${PORT}`))  