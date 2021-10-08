
const { Schema ,model} = require('mongoose')
//const User = require('./User')
const Post = require('./Post')

const profileSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    name :{
        type: String,
        trim : true,
        maxlength : 50,
        required: true
    },
    title:{
        type:String,
        trim:true,
        maxlength:100
    },
    bio:{
        type:String,
        trim:true,
        maxlength:500,
        required:true
    },
    profilePic: String,
    links:{
        website:String,
        facebook:String,
        twitter:String,
        github:String,
    },
  
    totalPost:{
        type:Number,
        default:0
    },
    totalLikes:{
        type:Number,
        default:0
    },
    totalComments:{
        type:Number,
        default:0
    },

    posts:[
        {
            type:Schema.Types.ObjectId,
            ref:'Post'
        }
    ],
    bookmarks:[
        {
            type:Schema.Types.ObjectId,
            ref:'Post'
        }
    ],
    follower:[
        {
            type:Schema.Types.ObjectId,
            ref:'User'
        }
    ],
     following:[
        {
            type:Schema.Types.ObjectId,
            ref:'User'
        }
    ]
    
},{
    timestamps:true
})

const Profile = model('Profile',profileSchema)
module.exports = Profile