const router = require('express').Router()
const {
    homeGetController
} = require('../controllers/homeController')

router.get('/',homeGetController)

module.exports= router

