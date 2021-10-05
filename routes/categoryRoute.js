const router = require('express').Router()
const categoryValidator = require('../validator/dashboard/post/categoryValidator')

const {
    categoryGetController,
    categoryPostController,
    singleCategoryGetController
} = require('../controllers/filterController')


router.get('/',categoryGetController)
router.get('/:catId',singleCategoryGetController)

router.post('/',categoryValidator,categoryPostController)


module.exports= router