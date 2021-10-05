const router = require('express').Router()
const {isAuthenticated} = require('../../middleware/authMidleware')

//comment reply
const{
    commentPostController,
    replyCommentPostController
} = require('../controllers/commentController')

//like dislike
const{
    likesGetController,
    dislikesGetController
} = require('../controllers/likeDislikeController')

//bookmark
const{
    bookmarksGetController
} = require('../controllers/bookmarkController')

//follow unfollow
const{
    followGetController,
    unfollowGetController
} = require('../controllers/followUnfollowController')

router.post('/comments/:postId',isAuthenticated,commentPostController)
router.post('/comments/replies/:commentId',isAuthenticated ,replyCommentPostController)

router.get('/likes/:postId',isAuthenticated,likesGetController)
router.get('/dislikes/:postId',isAuthenticated,dislikesGetController)

//follow unfollow author
router.get('/follow/:authorId',isAuthenticated,followGetController)
router.get('/dislikes/:authorId',isAuthenticated,unfollowGetController)

router.get('/bookmarks/:postId',isAuthenticated,bookmarksGetController)

module.exports = router