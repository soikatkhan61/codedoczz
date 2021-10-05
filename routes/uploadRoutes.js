const router = require('express').Router()

const {isAuthenticated} = require('../middleware/authMidleware')
const upload = require('../middleware/uploadMiddleware')

const {
    uploadProfilePics,
    postImageUploadController
} = require('../controllers/uploadController')

router.post('/profilepics',isAuthenticated,upload.single('profilePics'),uploadProfilePics)

router.post('/postimage',isAuthenticated,upload.single('post-image'),postImageUploadController)

module.exports = router