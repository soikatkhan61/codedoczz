const Flash = require('../utils/Flash')
const errorFormatter = require('../utils/validationErrorFormatter')
const  {validationResult} = require('express-validator')
const Category = require('../models/Category')


exports.categoryGetController = async (req,res,next) =>{
    try{

        let catgories = await Category.find()

        let c = await Category.findOne({category:'css'})

        res.render('pages/dashboard/category',{
            title: 'Category',
            flashMessage: Flash.getMessage(req),
            catgories
        })
    }catch(e){
        next(e)
    }
}



exports.categoryPostController = async (req,res,next) =>{

    let category = req.body
    let errors = validationResult(req).formatWith(errorFormatter)


    let catgories = await Category.find()
    if(!errors.isEmpty()){
        req.flash('fail','Category may be exist or cant grater than 100 char')
        return  res.render('pages/dashboard/category',{title:'Category',
        error:errors.mapped(),
        flashMessage : Flash.getMessage(req),
        catgories
        })
    }
   
    try{
        let newCategory = new Category(category)
        await newCategory.save()

        req.flash('success','category successfully')
        res.redirect('/category')
    }catch(e){
        console.log(e)
        next(e)
    }
}


exports.singleCategoryGetController = async (req,res,next) =>{
    try{

        let category = req.params.catId
        let categories = await Category.findOne({category:category})
            .populate({
                path:'posts',
                select:'title thumbnail author createdAt',
                populate:{
                    path:'author',
                    select:'username'
                }
            })


        let allcategory = await Category.find()

        
        res.render('pages/explorer/categorySearch',{
            flashMessage: Flash.getMessage(req),
            category,
            categories,
            allcategory
        })
    }catch(e){
        next(e)
    }
}
