require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const config = require('config')

const setMiddleware = require('./middleware/middleware')
const setRoutes = require('./routes/routes')

//database connection
const MONGODB_URI =`mongodb+srv://${config.get('db-username')}:${config.get('db-password')}@cluster0.hpstb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

const app = express()

console.log(config.get("name"));

//setup view engine
app.set('view engine' ,'ejs')
app.set('views','views')


// using middlware from midleware directory
setMiddleware(app)

//using route from route directory
setRoutes(app)

//not found
app.use((req,res,next)=>{
    let error = new Error('404 not found')
    error.status = 404
    next(error)
})

app.use((error,req,res,next)=>{
    //console.log(error)
    if(error.status ===404){
        return res.render('pages/error/404' ,{flashMessage:{}})
    }
    console.log(error)
    res.render('pages/error/500',{flashMessage:{}})
})


//create server
const PORT = process.env.PORT || 8080
mongoose.connect(MONGODB_URI,{useNewUrlParser:true,useUnifiedTopology: true})
.then(()=>{
    console.log("DATABASE CONNECTED")
    app.listen(PORT,()=>{
        console.log("SERVER IS RUNINNG ON PORT "+PORT)
    })
})
.catch(e =>{
    return console.log(e)
})

