const router = require('express').Router()

const signupValidator = require('../validator/auth/signupValidator')
const loginValidator = require('../validator/auth/loginValidator')

const {
    signupGetController,
    signupPostController,
    loginGetController,
    loginPostController,
    logoutController,
    changePasswordGetController,
    changePasswordPostController,
    verifyController
} = require('../controllers/authController')

const {
    isUnAuthenticated,
    isAuthenticated
} = require('../middleware/authMidleware')

router.get('/signup',isUnAuthenticated,signupGetController)
router.post('/signup',isUnAuthenticated,signupValidator,signupPostController)


router.get('/login',isUnAuthenticated,loginGetController)
router.post('/login',isUnAuthenticated,loginValidator,loginPostController)

router.get('/change-password',isAuthenticated,changePasswordGetController)
router.post('/change-password',isAuthenticated,changePasswordPostController)

router.get('/verify-account/:v_id',verifyController)

router.get('/logout',logoutController)





module.exports = router