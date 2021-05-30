'use strict'
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const path = require('path')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_ID,
  resave: false,
  saveUninitialized: false
}))

const loginRouter = require('./loginRouter.js')(app, passport)

app.use(express.static(path.join(__dirname, '..', 'public')))
app.use('/', loginRouter)

const port = process.env.PORT
app.listen(port)
console.log('Express server running on port', port)
