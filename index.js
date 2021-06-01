'use strict'

//This file currently enables the routing to all the group home pages 


const express = require('express')
const groupRouter = require('./group-routes')
const path = require('path')
const app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.use(groupRouter)
const port = 3500 || process.env.PORT
app.listen(port)
console.log('Express server running on port', port)


