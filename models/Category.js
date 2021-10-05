const Post = require('./Post')
const {Schema,model} = require('mongoose')

const categorySchema = new Schema({
    
    category:{
        type:String,
        trim:true,
        unique:true
    },
    posts:[
        {
            type:Schema.Types.ObjectId,
            ref:'Post'
        }
    ]
    
},{
    timestamps:true
})


const Category  = model('Category', categorySchema)

module.exports = Category