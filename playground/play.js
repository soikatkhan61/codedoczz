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

    async function sendEmailVerificatonLink(){
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, 
            auth: {
                user: 'mdsoikat9', //Remove '@gmail.com' from your username.
                pass: 'FUCKMYMIND69' 
             }
           });
    
        var mailOptions = {
            from:'soikatkhan61@gmail.com',
            to:'obaydullahkhaan@gmail.com',
            subject:'Please verify your account!',
            text: 'Thnaky you'
        }
    
        await transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error)
            }else{ 
                res.send('email sent: '+info.response) 
                console.log('email sent: '+info.response)
            }
        })
    }
    sendEmailVerificatonLink().catch(console.error)
    
   
})

router.post('/play',upload.single('my-file'),(req,res,next)=>{
    if(req.file){
        console.log(req.file)
    }
   res.redirect('/playground/play')
})


module.exports = router