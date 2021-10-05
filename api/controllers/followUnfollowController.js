const Profile = require('../../models/Profile')
const User = require('../../models/User')

exports.followGetController =  async (req,res,next)=>{
    let {authorId} = req.params  
    if(!req.user){
        return res.status(403).json({
            error:'Your are not authenticated user'
        })
    }

    let userId = req.user._id
    let followed = null
    //console.log("user id: "+userId)  
    try{
        let author = await User.findById(authorId)
            .populate({
                path:'profile',
                select:'follower following'
            })
        let user = await User.findById(userId)
            .populate({
                path:'profile',
                select:'follower following'
            })

        //console.log(user)

        if(author.profile.follower.includes(userId)){
            await Profile.findOneAndUpdate(
                {_id:author.profile._id},
                {$pull: {'follower' : userId}}
            )

            await Profile.findOneAndUpdate(
                {_id:user.profile._id},
                {$pull: {'following' : authorId}}
            )
            followed = false
        }else{
            await Profile.findOneAndUpdate(
                {_id:author.profile._id},
                {$push: {'follower' : userId}}
            )

            await Profile.findOneAndUpdate(
                {_id:user.profile._id},
                {$push: {'following' : authorId}}
            )
            followed = true
        }
        let updatedProfile = await Profile.findById(author.profile._id)
        res.status(200).json({
            followed,
            totalFollwer : updatedProfile.follower.length,
            totalfollowing : updatedProfile.following.length
        })
       
        //console.log("auhtor profile: "+author.profile._id)  
    }catch(e){
        console.log(e)
        return res.status(500).json({
            error:'Server error'
        })
    }
    

   
}

exports.unfollowGetController = async (req,res,next) =>{
    let {postId} = req.params
    let disliked = null


   
}