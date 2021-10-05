const {body} = require('express-validator')
const User = require('../../../models/Category')

module.exports = [
    body('category')
        .not().isEmpty().withMessage('Category cannot be empty')
        .isLength({max:100}).withMessage('Categoiry name cannot be greater than 100 char')
        .trim()
        .custom(async category =>{
            let categoryExist = await User.findOne({category})
            if(categoryExist){
                return Promise.reject('category already used')
            } 
        })
]