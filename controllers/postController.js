const {validationResult} =  require('express-validator')
const readingTime=  require('reading-time')
const Flash = require('../utils/Flash')
const errorFormatter = require('../utils/validationErrorFormatter')
const Post = require('../models/Post')
const Profile = require('../models/Profile')
const Category = require('../models/Category')



exports.createPostGetController = async (req,res,next) =>{
    
    let profile = await Profile.findOne({user:req.user._id})
    if(!profile){
        return  res.redirect('/dashboard/create-profile')
    }
    
    let categories = await Category.find()
    res.render('pages/dashboard/post/createPost',{
        title: 'Create a new post',
        error :{},
        flashMessage: Flash.getMessage(req),
        value:{},
        categories
    })
}

exports.createPostPostController = async(req,res,next) =>{
    let {title,body,tags,category} = req.body
    let errors = validationResult(req).formatWith(errorFormatter)

    if(!errors.isEmpty()){
        let categories = await Category.find()
        res.render('pages/dashboard/post/createPost',{
            title: 'Create a new post',
            error :errors.mapped(),
            flashMessage: Flash.getMessage(req),
            value:{
                title,
                body,
                tags,
                category
            },
            categories
        })
    }

    if(tags){
        tags = tags.split(',')
        tags = tags.map(t=>t.trim())
    }

    let readTime = readingTime(body).text

    let post = new Post({
        title,
        body,
        category,
        tags,
        author:req.user._id,
        thumbnail : '',
        readTime,
        likes:[],
        dislikes:[],
        comments:[]
    })
    
    if(req.file){
        post.thumbnail = `/uploads/${req.file.filename}`
    }

    //records update

    try{
        let createdPost = await post.save()
        let findCategory = await Category.findOne({category:category})
        let profile = await Profile.findOne({user:req.user._id})
        
        await Profile.findOneAndUpdate(
            {user:req.user._id},
            {$push:{'posts':createdPost._id},totalPost:profile.totalPost+1}
        )
        await Category.findOneAndUpdate(
            {_id:findCategory._id},
            {$push:{'posts':createdPost._id}}
        )
        req.flash('success','Post created successfully')
        res.redirect(`/explorer/${createdPost._id}`)
    }catch(e){
        next(e)
    }
}

exports.editPostGetController = async (req,res,next) =>{
    let postId = req.params.postId

    try{
        let post =  await Post.findOne({author:req.user._id, _id:postId})
        
        if(!post){
            let error = new Error('404 page not found')
            error.status = 404
            throw error
         }

         res.render('pages/dashboard/post/editPost',{
             title : 'Edit your post',
             error:{},
             flashMessage :Flash.getMessage(req),
             post

         })
    }catch(e){
        next(e)
    }
}

exports.editPostPostController = async (req,res,next) =>{
    let {title,body,tags} = req.body
    let postId = req.params.postId
    let errors = validationResult(req).formatWith(errorFormatter)

    try{
        let post =  await Post.findOne({author:req.user._id, _id:postId})

        if(!post){
            let error = new Error('404 page not found')
            error.status = 404
            throw error
         }

         if(!errors.isEmpty()){
            res.render('pages/dashboard/post/createPost',{
                title: 'Create a new post',
                error :errors.mapped(),
                flashMessage: Flash.getMessage(req),
                post
                
            })
        }
    
        if(tags){
            tags = tags.split(',')
            tags = tags.map(t=>t.trim())
        }

        let thumbnail = post.thumbnail
        if(req.file){
            thumbnail = req.file.filename
        }

        await Post.findOneAndUpdate(
            {_id:post._id},
            {$set: {title,body,tags,thumbnail}},
            {new:true}
        )

        req.flash('success',"Post updated successfully")
        res.redirect('/posts')


    }catch(e){
        next(e)
    }

}

exports.deletePostGetController =  async (req,res,next) =>{
    let {postId} = req.params

    try{
        let post = await Post.findOne({author:req.user._id , _id:postId})
        if(!post){
            let error = new Error('404 page not found')
            throw error
        }

        await Post.findOneAndDelete({_id:postId})
        await Profile.findOneAndUpdate(
            {user:req.user._id},
            {$pull : {'posts':postId}}
        )

        req.flash('sucess','Post delete Successfully')
        res.redirect('/posts')
    }catch(e){
        next(e)
    }
}

exports.postsGetController = async (req,res,next) =>{
    try{
        let posts = await Post.find({author:req.user._id})
        res.render('pages/dashboard/post/posts',{
            title: 'My created post',
            posts,
            flashMessage:Flash.getMessage(req)
        })
    }catch(e){
        next(e)
    }
}