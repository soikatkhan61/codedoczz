const User = require('../models/User')
const Profile = require('../models/Profile')
const Post = require('../models/Post')
const Category = require('../models/Category')
const Comment = require('../models/Comment')

const router = require('express').Router()
const upload = require('../middleware/uploadMiddleware')

const Flash =  require('../utils/Flash')

router.get('/play',async(req,res,next)=>{

   let profile =await Profile.findOneAndUpdate({user:req.user._id})
   //let update = profile.totalPost + 1
   await Profile.findOneAndUpdate({user:req.user._id},{
    totalPost: profile.totalPost + 1,
    totalLikes: profile.totalLikes + 1
   })
 
    res.json({
        profile
    })
})

router.post('/play',upload.single('my-file'),(req,res,next)=>{
    if(req.file){
        console.log(req.file)
    }
   res.redirect('/playground/play')
})


module.exports = router