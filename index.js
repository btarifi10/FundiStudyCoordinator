'use strict'

/* Loop through  dropdown buttons to toggle between hiding and showing its dropdown content
- This allows the user to have multiple dropdowns without any conflict */

const express = require('express')
const groupRouter = require('./group-routes')
const path = require('path')
const app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.use(groupRouter)
// const port = process.env.PORT || 3100
const port = 3100 || process.env.PORT
app.listen(port)
console.log('Express server running on port', port)


