const  bcrypt = require('bcrypt')
const  jwt = require('jsonwebtoken')
const  config = require('config')
const  User = require('../models/User')
const  {validationResult} = require('express-validator')
const  errorFormatter = require('../utils/validationErrorFormatter')
const  Flash = require('../utils/Flash')
const nodemailer = require('nodemailer')
const {google} = require('googleapis')

const CLIENT_ID = '221485066111-6dcucndtpmm2tcvothl6bfanh1ets1o2.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04zJSF8B9sRhWCgYIARAAGAQSNwF-L9IryBwEj3VM8h9kx-j2PbRyv2NapNMosJ3oAsYwxeFlfVfyCNS-A3rDIwmH-uv_ZZDbg7w'

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN})


exports.signupGetController = (req,res,next) =>{
    res.render('pages/auth/signup-in',{
        title:'Create a new account',
        error:{}, 
        value:{},
        signup_mode:true,
        flashMessage : Flash.getMessage(req)
    } )
}

exports.signupPostController = async (req,res,next) =>{
   let {username,email,password,c_password} = req.body

   let errors = validationResult(req).formatWith(errorFormatter)

   
   if(!errors.isEmpty()){
       req.flash('fail','Please check your form')
       return  res.render('pages/auth/signup-in',{title:'Create a new account',
       error:errors.mapped(),
       value:{
            username,email,password
       },
       signup_mode:true,
       flashMessage : Flash.getMessage(req)
    })
   }

   
   try{
        let hashPassword = await bcrypt.hash(password,11)
        let user = new User({
            username,
            email,
            password: hashPassword,
        })
        let createdUser = await user.save()
        req.flash('success','User created successfully')

        let v_id = await User.findByIdAndUpdate({_id:createdUser._id},{verification_id:Math.floor(Math.random() * (99999999 - 11111111 + 1) + 11111111)},{new:true})

        v_id = v_id.verification_id

        async function sendMail(){

            try{
                const accessToken = await oAuth2Client.getAccessToken()


                const transport = nodemailer.createTransport({
                    service:'gmail',
                    auth:{
                        type:'OAuth2',
                        user:'soikatkhan61@gmail.com',
                        clientId: CLIENT_ID,
                        clientSecret:CLIENT_SECRET,
                        refreshToken:REFRESH_TOKEN,
                        accessToken:accessToken
                    }
                })

                const mailOptions={
                    from:'codeDocz <codedoczbox@gamil.com>',
                    to:`${createdUser.email}`,
                    subject:'Please verify your account!',
                    html: `
                        <div>
                            <p>Thank your for signup. to verify click this link 
                            
                            <a href="http://${req.hostname}/auth/verify-account/${v_id}" > http://${req.hostname}/auth/verify-account/${v_id} 
                            
                            </a>
                            </p>
                        </div>
                    `
                }

                await transport.sendMail(mailOptions,function(error,info){
                        if(error){
                            console.log(error)
                        }else{
                            res.render('pages/auth/verify-check',{
                                user,
                                flashMessage : Flash.getMessage(req)
                            })
                            console.log('email sent: '+info.response)
                        }
                    })
               
            }catch(e){
                next(e) 
            }
        } 

        sendMail().then(result=> console.log("Email sent:..."+result))
            .catch(error=>console.log(error))

   }
   catch(e){
       next(e)
   }
  
}

exports.verifyController = async(req,res,next) =>{
   
    let verify_id =  req.params.v_id
    if(verify_id < 1 ){
        req.flash('fail','verification id in not valid')
        return res.redirect('/auth/verify-check')
    }
    try{
        await User.findOneAndUpdate({verification_id:verify_id},{isVerified:true,verification_id:-1})
        req.flash('success','verification successfully')
        res.redirect('/dashboard')
    }catch(e){
        next(e)
    }
}

exports.loginGetController = (req,res,next) =>{
    res.render('pages/auth/signup-in' ,
    {
        title: "Login to your account",
        error:{},
        value:{},
        signup_mode:false,
        flashMessage : Flash.getMessage(req)
    })
}

exports.loginPostController = async (req,res,next) =>{
    let {email,password} = req.body
    
    let errors = validationResult(req).formatWith(errorFormatter)

    
    if(!errors.isEmpty()){
        req.flash('fail','Please check your form')
        return  res.render('pages/auth/signup-in',
        {
            title:'Login here!',
            error:errors.mapped(),
            signup_mode:false,
            value:{
                email
            },
            flashMessage : Flash.getMessage(req)

         })
    }

    try{
        let user = await User.findOne({email})
        if(!user){

            req.flash('fail','Wrong Credential')
            return  res.render('pages/auth/signup-in',
            {
                title:'Login here!',
                error:errors.mapped(),
                signup_mode:false,
                value:{
                    email
                },
                flashMessage : Flash.getMessage(req)
    
             })
        }

        let password_match = await bcrypt.compare(password, user.password)
        if(!password_match){

            req.flash('fail','Wrong Credential')
            return  res.render('pages/auth/signup-in',
            {
                title:'Login here!',
                error:errors.mapped(),
                signup_mode:false,
                value:{
                    email
                },
                flashMessage : Flash.getMessage(req)
    
             })
        }

        if(!user.isVerified){
            return  res.render('pages/auth/verify-check',
            {
                flashMessage : Flash.getMessage(req),
                user
            }
            )
        }
        // const token = jwt.sign({
        //     username: user.username,
        //     userId: user._id
        // },config.get('secret'),{expiresIn: '30d'})

        req.session.isLoggedIn = true
       // req.session.token = token
        req.session.user = user

        req.session.save(err=>{
            if(err){
                console.log(err)
                return next(err)
            }
            req.flash('success','Successfully Logged In')
            res.redirect('/explorer')
        })
       
    }
    catch(e){
        next(e)
    }
}

exports.logoutController = (req,res,next) =>{
   
    req.session.destroy(err =>{
        if(err){
            return next(err)
        }
        return res.redirect('/auth/login')
    })

   
}

exports.changePasswordGetController = async (req,res,next) =>{
    res.render('pages/auth/changePassword',{
        title: 'Change Password',
        flashMessage: Flash.getMessage(req)
    })
}

exports.changePasswordPostController = async (req,res,next) =>{

    let {oldPassword,newPassword,confirmPassword} = req.body

    if(newPassword !== confirmPassword){
        req.flash('fail','Password dose not match!')
        return res.redirect('/auth/change-password')
    }

    try{
        let match = await bcrypt.compare(oldPassword,req.user.password)

        if(!match){
            req.flash('fail','invalid old password!')
            return res.redirect('/auth/change-password')
        }

        let hash = await bcrypt.hash(newPassword,11)
        await User.findOneAndUpdate(
            {_id:req.user._id},
            {$set: {password: hash}}
        )
        req.flash('success','password update successfully')
        return res.redirect('/auth/change-password')
    }catch(e){
        next(e)
    }
}

exports.forgotPasswordGetController = (req,res,next) =>{
    
    res.render("pages/auth/forgot-password",{
        flashMessage: Flash.getMessage(req)
    })

}

exports.forgotPasswordPostController = async(req,res,next) =>{
    
    let userEmail =  req.body.email
    try{
        //find the user
        let user = await User.findOne({email:userEmail});
        if(!user){
            req.flash('fail','User not exist!')
            res.render("pages/auth/forgot-password",{
                flashMessage: Flash.getMessage(req)
            })
        }

        //create one time token
        const secret = config.get('secret') + user.password
        const payload = {
            email: user.email,
            id: user._id
        }

        const token = jwt.sign(payload,secret,{expiresIn:'5s'})
        const link = `http://localhost:8080/auth/reset-password/${user._id}/${token}`
        console.log(link)
        res.send("password reset link has been sent...")
        


        // async function sendMail(){

        //     try{
        //         const accessToken = await oAuth2Client.getAccessToken()


        //         const transport = nodemailer.createTransport({
        //             service:'gmail',
        //             auth:{
        //                 type:'OAuth2',
        //                 user:'soikatkhan61@gmail.com',
        //                 clientId: CLIENT_ID,
        //                 clientSecret:CLIENT_SECRET,
        //                 refreshToken:REFRESH_TOKEN,
        //                 accessToken:accessToken
        //             }
        //         })

        //         const mailOptions={
        //             from:'codeDocz <codedoczbox@gamil.com>',
        //             to:`${userEmail}`,
        //             subject:'Please verify your account!',
        //             html: `
        //                 <div>
        //                     <p>To reset your password click here 
                            
        //                     <a href="http://${req.hostname}/auth/reset-password/${v_id}" > http://${req.hostname}/auth/reset-password/${v_id} 
                            
        //                     </a>
        //                     </p>
        //                 </div>
        //             `
        //         }

        //         await transport.sendMail(mailOptions,function(error,info){
        //                 if(error){
        //                     console.log(error)
        //                 }else{
        //                     res.render('pages/auth/verify-check',{
        //                         user,
        //                         flashMessage : Flash.getMessage(req)
        //                     })
        //                     console.log('email sent: '+info.response)
        //                 }
        //             })
               
        //     }catch(e){
        //         next(e) 
        //     }
        // } 

        // sendMail().then(result=> console.log("Email sent:..."+result))
        //     .catch(error=>console.log(error))
    }catch(e){
        next(e)
    }

}

exports.resetPasswordGetController = async (req,res,next) =>{
    console.log("from reset password")
    let {userId,token} =  req.params
    
    //check the user is exist
    let user = await User.findById({_id:userId})
    if(!user){
        res.send("invalid id")
        return
    }

    //if id is valid
    const secret = config.get('secret') + user.password
    try{
        const payload = await jwt.verify(token,secret)
 
        res.render('pages/auth/reset-password',{
            title: 'Reset Password',
            user,
            flashMessage: Flash.getMessage(req)
        })
    }catch(e){
        req.flash('fail',`${e.message}`)
        return res.render("pages/auth/forgot-password",{
            flashMessage: Flash.getMessage(req)
        })
    }
    
}

exports.resetPasswordPostController = async (req,res,next) =>{
    let {userId,token} =  req.params

    let user = await User.findById({_id:userId})
    if(!user){
        res.send("invalid id")
        return
    }

    const secret = config.get('secret') + user.password
    try {
        const payload = jwt.verify(token,secret)
        let {password,c_password} = req.body

        if(password !== c_password){
            req.flash('fail','Password dose not match!')
            return res.redirect(`/auth/reset-password/`)
        }
        let hash = await bcrypt.hash(password,11)
        
        await User.findOneAndUpdate({_id:userId},{$set: {password: hash},verification_id:-1})

        req.flash('success','password reset successfully')
        return res.redirect('/auth/login')


    } catch (e) {
        next(e)
    }
}
