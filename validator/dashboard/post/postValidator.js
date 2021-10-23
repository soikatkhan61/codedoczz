const {body} = require('express-validator')
const cheerio = require('cheerio')

module.exports = [
    body('title')
        .not().isEmpty().withMessage('Title cannot be empty')
        .isLength({max:100}).withMessage('Title cannot be greater than 100 char')
        .trim(),
    body('body')
        .not().isEmpty().withMessage('Body cannot be empty')
        .custom(value => {
            let node = cheerio.load(value)
            let text = node.text()

            if(text.length > 50000){
                throw new Error ('body cannot be greater than 5000 char')
            }

            return true
        })
]