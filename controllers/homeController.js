const moment = require('moment')
const Flash = require('../utils/Flash')
const Post = require('../models/Post')
const Category = require('../models/Category')
const Profile = require('../models/Profile')

function genDate(days){
    let date = moment().subtract(days,'days')
    return date.toDate()

    
}

function generateFilterObject(filter){
    let filterObj = {}
    let order = 1

    switch(filter){
        case 'week':{
            filterObj ={
                createdAt:{
                    $gt:genDate(7)
                }
            }
            order = -1
            break
        }

        case 'month':{
            filterObj ={
                createdAt:{
                    $gt:genDate(30)
                }
            }
            order = -1
            break
        }

        case 'all':{
            order = -1
            break
        }

    }

    return {
        filterObj,
        order
    }
}


exports.homeGetController =async (req,res,next) =>{
    let filter = req.query.filter || 'latest'
    let currentPage = parseInt(req.query.page) || 1
    let itemPerPage = 6

    var {order,filterObj} = generateFilterObject(filter.toLowerCase())

    try{
        let posts = await Post.find(filterObj)
            .populate('author','username')
            .sort(order === 1 ? '-createdAt' : 'createdAt')
            .skip((itemPerPage*currentPage) - itemPerPage)
            .limit(itemPerPage)
        
        let totalPost = await Post.countDocuments()
        let totalPage = totalPost/itemPerPage

        let bookmarks = []
        if(req.user){
            let profile = await Profile.findOne({user: req.user._id})
            if(profile){
                bookmarks = profile.bookmarks
            }
            
        }

        let categories = await Category.find()   
      //  console.log(posts)
        res.render('index',{
            title: 'Home page',
            filter,
            flashMessage: Flash.getMessage(req),
            posts,
            itemPerPage,
            currentPage,
            totalPage,
            bookmarks,
            categories
        })
    }catch(e){
        next(e)
    }

}

