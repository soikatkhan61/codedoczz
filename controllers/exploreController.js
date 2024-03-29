const moment = require('moment')
const Flash = require('../utils/Flash')
const Post = require('../models/Post')
const User = require('../models/User')
const Comment = require('../models/Comment')
const Profile = require('../models/Profile')
const Category = require('../models/Category')

function genDate(days) {
    let date = moment().subtract(days, 'days')
    return date.toDate()
}

function generateFilterObject(filter) {
    let filterObj = {}
    let order = 1

    switch (filter) {
        case 'week': {
            filterObj = {
                createdAt: {
                    $gt: genDate(7)
                }
            }
            order = -1
            break
        }

        case 'month': {
            filterObj = {
                createdAt: {
                    $gt: genDate(30)
                }
            }
            order = -1
            break
        }

        case 'all': {
            order = -1
            break
        }

    }

    return {
        filterObj,
        order
    }
}


exports.explorerGetController = async (req, res, next) => {

    let filter = req.query.filter || 'latest'
    let currentPage = parseInt(req.query.page) || 1
    let itemPerPage = 10

    var { order, filterObj } = generateFilterObject(filter.toLowerCase())

    try {
        let posts = await Post.find(filterObj)
            .populate({
                path: 'author',
                select: 'username'
            })
            .sort(order === 1 ? '-createdAt' : 'createdAt')
            .skip((itemPerPage * currentPage) - itemPerPage)
            .limit(itemPerPage)


       

        let totalPost = await Post.countDocuments()
        let totalPage = totalPost / itemPerPage

        let bookmarks = []
        if (req.user) {
            let profile = await Profile.findOne({ user: req.user._id })
            if (profile) {
                bookmarks = profile.bookmarks
            }

        }
        let categories = await Category.find()
        let topUser =  await Profile.find().sort("-totalPost name").limit(10)

        res.render('pages/explorer/explorer', {
            title: 'Explore All Post',
            filter,
            flashMessage: Flash.getMessage(req),
            posts,
            itemPerPage,
            currentPage,
            totalPage,
            bookmarks,
            categories,
            topUser
        })
    } catch (e) {
        next(e)
    }

}

exports.singlePostGetController = async (req, res, next) => {
    let { postId } = req.params
    try {
        let post = await Post.findById(postId)
            .populate({
                path: 'author',
                select: 'username profilePics',
                populate: {
                    path: 'profile',
                    select: 'follower following'
                }
                })
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    seletct: 'username profilePics'
                }
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'replies.user',
                    select: 'username profilePics'
                }
            })

        if (!post) {
            let error = new Error('404 page not foud')
            error.status(404)
            throw error
        }
        await Post.findByIdAndUpdate({_id:postId},{views:post.views + 1},{new:true})
        let bookmarks = []

        if (req.user) {
            let profile = await Profile.findOne({ user: req.user._id })
            if (profile) {
                bookmarks = profile.bookmarks
            }
        }
        let categories = await Category.find()
        res.render('pages/explorer/singlePage', {
            title: post.title,
            flashMessage: Flash.getMessage(req),
            post,
            bookmarks,
            categories
        })
    } catch (e) {
        next(e)
    }
}


