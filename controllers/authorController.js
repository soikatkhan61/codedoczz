const Flash = require('../utils/Flash')
const User = require('../models/User')
const Profile = require('../models/Profile')

exports.authorProfileGetController = async (req,res,next) =>{

    let userId = req.params.userId

    try{
        
        let author = await User.findById(userId)
            .populate({
                path:'profile',
                populate:{
                    path:'posts bookmarks'
                }
            })
        let profile = await Profile.findOne({user:req.user._id})
        if(!profile){
            return  res.redirect('/dashboard/create-profile')
        }
        // if(!author.profile){
        //     res.redirect('pages/dashboard/create-profile')
        // }
        res.render('pages/explorer/author',{
            title: 'Author page',
            flashMessage: Flash.getMessage(req),
            author
        })

            //console.log(author)
    }catch(e){
        next(e)
    }
}