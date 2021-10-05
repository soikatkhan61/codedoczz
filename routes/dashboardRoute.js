const router  = require('express').Router()
const {isAuthenticated} = require('../middleware/authMidleware')
const profileValidator = require('../validator/dashboard/profileValidator')

const {
    dashboardGetController,
    createProfileGetController,
    createProfilePostController,
    editProfileGetController,
    editProfilePostController,
    bookmarkGetController,
    commentsGetController
} = require('../controllers/dashboardController')

router.get('/bookmarks',isAuthenticated,bookmarkGetController)

router.get('/comments',isAuthenticated,commentsGetController)

router.get('/create-profile',isAuthenticated,createProfileGetController)
router.post('/create-profile',isAuthenticated,profileValidator,createProfilePostController)

router.get('/edit-profile',isAuthenticated,editProfileGetController)
router.post('/edit-profile',isAuthenticated,editProfilePostController)

router.get('/',isAuthenticated, dashboardGetController)

module.exports = router