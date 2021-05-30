'use strict'

const express = require('express')
const path = require('path')

const app = express()
app.use(express.urlencoded({ extended: false }))

const loginRouter = require('./loginRouter.js')
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use('/', loginRouter)

const port = 6969
app.listen(port)
console.log('Express server running on port', port)
