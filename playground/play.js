const User = require('../models/User')
const Profile = require('../models/Profile')
const Post = require('../models/Post')
const Category = require('../models/Category')
const Comment = require('../models/Comment')
const nodemailer = require('nodemailer')

const router = require('express').Router()
const upload = require('../middleware/uploadMiddleware')

const Flash =  require('../utils/Flash')

router.get('/play',async(req,res,next)=>{
    res.render("playground/play" ,{
        flashMessage : Flash.getMessage(req)
    })
    
  
})

router.post('/play',upload.single('my-file'),(req,res,next)=>{
    if(req.file){
        console.log(req.file)
    }
   res.redirect('/playground/play')
})


module.exports = router