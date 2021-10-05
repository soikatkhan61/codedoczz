const {validationResult} = require('express-validator')
const Flash = require('../utils/Flash')
const Profile = require('../models/Profile')
const User = require('../models/User')
const Comment = require('../models/Comment')
const errorFormatter = require('../utils/validationErrorFormatter')

exports.dashboardGetController =async (req,res,next) =>{

    try{
        let profile = await Profile.findOne({user: req.user._id})
            .populate({
                path: 'posts',
                select:'title thumbnail'
            })
            .populate({
                path:'bookmarks',
                select:'title thumbnail'
            })
        if(profile){
            return res.render('pages/dashboard/dashboard',
            {
                title: 'My Dashboard',
                flashMessage : Flash.getMessage(req),
                posts: profile.posts.reverse().slice(0,3),
                bookmarks:profile.bookmarks.reverse().slice(0,3)
            })
        }

        res.redirect('/dashboard/create-profile')
    }catch(e){
        console.log(e)
    }


}

exports.createProfileGetController =async (req,res,next) =>{
    try{
        let profile = await Profile.findOne({user: req.user._id})
        if(profile){
           return res.redirect('/dashboard/edit-profile')
        }

        res.render('pages/dashboard/create-profile',{
            title:'Create your profile',
            error:{},
            flashMessage: Flash.getMessage(req)
        })
    }catch(e){
        console.log(e)
    }
}

exports.createProfilePostController =async (req,res,next) =>{
    let errors = validationResult(req).formatWith(errorFormatter)
    console.log(errors)

    if(!errors.isEmpty()){
        res.render('pages/dashboard/create-profile',{
            title:'Create your profile',
            error:errors.mapped(),
            flashMessage: Flash.getMessage(req)
        })
    }

    let {
        name,
        title,
        bio
    } = req.body

    try{
        let profile = new Profile({
            user: req.user._id,
            name,
            title,
            bio,
            posts : [],
            bookmark : []
        })

        let createdProfile = await profile.save()
        await User.findOneAndUpdate(
            {_id: req.user._id},
            {$set:{profile: createdProfile._id}}
        )

        req.flash('success','Profile Created successfully')
        res.redirect('/dashboard')
    }catch(e){
        console.log(e)
        next(e)
    }
}

exports.editProfileGetController = async(req,res,next) =>{
    try{
        let profile = await Profile.findOne({user:req.user._id})
        if(!profile){
          return  res.redirect('/dashboard/create-profile')
        }
        res.render('pages/dashboard/edit-profile',{
            title:'Edit your profile',
            error:{},
            flashMessage: Flash.getMessage(req),
            profile
        })
    }catch(e){
        console.log(e)
        next(e)
    }
}

exports.editProfilePostController = async(req,res,next) =>{

    let {
        name,
        title,
        bio
    } = req.body

    let errors = validationResult(req).formatWith(errorFormatter)
    console.log(errors)

    if(!errors.isEmpty()){
        res.render('pages/dashboard/create-profile',{
            title:'Create your profile',
            error:errors.mapped(),
            flashMessage: Flash.getMessage(req),
            profile:{
                name,
                title,
                bio
            }
        })
    }

    try{
        let profile = {
            name,
            title,
            bio
        }

        let updatedProfile = await Profile.findOneAndUpdate(
            {user: req.user._id},
            {$set:profile},
            {new:true}
        )
        req.flash('success','Profile Updated successfully')
        res.render('pages/dashboard/edit-profile',{
            title:'Edit your profile',
            error:{},
            flashMessage: Flash.getMessage(req),
            profile:updatedProfile
        })
    }catch(e){
        console.log(e)
        next(e)
    }
}

exports.bookmarkGetController = async(req,res,next) =>{

    try{
        let profile = await Profile.findOne({user: req.user._id})
            .populate({
                path: 'bookmarks',
                model: 'Post',
                select: 'title thumbnail'
            })
        if(!profile){
            return  res.redirect('/dashboard/create-profile')
        }

        res.render('pages/dashboard/bookmarks',{
            title: 'My Bookmarks',
            flashMessage : Flash.getMessage(req),
            posts: profile.bookmarks
        })
    }catch(e){
        //console.log(e)
        next(e)
    }
}

exports.commentsGetController = async(req,res,next) =>{

    try{
        let profile = await Profile.findOne({user: req.user._id})
        if(!profile){
            return  res.redirect('/dashboard/create-profile')
        }
        
        let comments = await Comment.find({post: {$in: profile.posts}})
            .populate({
                path:'post',
                select:'title'
            })
            .populate({
                path:'user',
                select:'username profilePics'
            })
            .populate({
                path:'replies.user',
                select: 'username profilePics'
            })

           // console.log(comments.posts.title)
            res.render('pages/dashboard/comments',{
                title: 'My recent comments',
                flashMessage: Flash.getMessage(req),
                comments
            })


    }catch(e){
        //console.log(e)
        next(e)
    }
}