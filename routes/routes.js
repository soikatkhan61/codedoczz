const authRoute = require('./authRoute')
const dashboardRoute = require('./dashboardRoute')
const play = require('../playground/play')
const uploadRoute = require('./uploadRoutes')
const postRoute = require('./postRoute')
const explorRoute = require('./exploreRoute')
const searchRoute = require('./searchRoute')
const authorRoute = require('./authorRoutes')
const categoryRoute = require('./categoryRoute')
const homeRoute = require('./homeRoute')

const apiRoutes = require('../api/routes/apiRoutes')

const routes =[
    {
        path:'/auth',
        handler: authRoute
    },
    {
        path:'/dashboard',
        handler: dashboardRoute
    },
    {
        path:'/uploads',
        handler: uploadRoute
    },
    {
        path:'/explorer',
        handler: explorRoute
    },
    {
        path:'/search',
        handler: searchRoute
    },
    {
        path:'/author',
        handler: authorRoute
    },
    {
        path:'/posts',
        handler: postRoute
    },
    {
        path:'/api',
        handler: apiRoutes
    },
    {
        path:'/category',
        handler: categoryRoute
    },
    {
        path:'/playground',
        handler: play
    },
    {
        path:'/',
        handler: homeRoute
    }
]

module.exports = app =>{
    routes.forEach(r =>{
        if(r.path === '/'){
            app.get('/',r.handler)
        }else{
            app.use(r.path, r.handler)
        }
    })
}