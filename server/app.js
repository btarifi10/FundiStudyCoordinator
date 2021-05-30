'use strict'
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const path = require('path')

const app = express()
app.use(express.urlencoded({ extended: false }))

const loginRouter = require('./loginRouter.js')
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use('/', loginRouter)

const port = process.env.PORT
app.listen(port)
console.log('Express server running on port', port)
