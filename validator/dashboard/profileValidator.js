const {body} =  require('express-validator')

module.exports = [
    body('name')
        .not().isEmpty().withMessage('Name cannot be empty')
        .isLength({max:50}).withMessage('Cannot be greture then 50 char')
    ,
    body('title')
        .not().isEmpty().withMessage('Title cannot be empty')
        .isLength({max:100}).withMessage('Title cannot be greature than 100')
    ,
    body('bio')
        .not().isEmpty().withMessage('Bio cannot be empty')
        .isLength({max:500}).withMessage('Bio cannot be greature than 100')
]