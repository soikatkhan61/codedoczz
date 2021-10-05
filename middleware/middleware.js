const express = require('express')
const morgan = require('morgan')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');

//import our middleware
const {bindUserWithRequest} = require('./authMidleware');
const setLocals = require('./setLocals')

const MONGODB_URI =' mongodb://localhost:27017'

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
    expires: 1000*60*60*24
  });


const middleware =[
    morgan('dev'),
    express.static('public'),
    express.urlencoded({extended:true}),
    express.json(),
    session({
        secret: process.env.SECRET_KEY || 'SECRET KEY',
        resave:false,
        saveUninitialized:false,
        store: store
    }),
    flash(),
    bindUserWithRequest(),
    setLocals()
   
]

module.exports = app =>{
    middleware.forEach(m =>{
        app.use(m)
    })
}