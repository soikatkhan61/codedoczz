const {Schema, model} = require('mongoose')
const User = require('./User')
const Comment = require('./Comment')

const postSchema = new Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        maxlength:100
    },
    body:{
        type:String,
        required:true,
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    category:{
        type:String,
        required:true
    },
    tags:{
        type:[String],
        required:true
    },
    thumbnail:String,
    readTime:String,
    views:{
        type:Number,
        default:0
    },
    likes:[{
        type:Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislikes:[{
        type:Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments:[
        {
            type:Schema.Types.ObjectId,
            ref:'Comment'
        }
    ],
    replies:[
        {
            type:Schema.Types.ObjectId,
            ref:'Comment'
        }
    ]
},{timestamps:true})

//index search
postSchema.index({
    title: 'text',
    body:'text',
    tags:'text'
},{
    weights:{
        title:5,
        tags:5,
        body:2
    }
})

const Post = model('Post',postSchema)
module.exports = Post