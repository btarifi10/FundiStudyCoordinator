'use strict'

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/createGroup', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'create-join-group.html'))
})

const port = process.env.PORT || 3000
//This file currently enables the routing to all the group home pages 


const express = require('express')
const groupRouter = require('./group-routes')
const path = require('path')
const app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.use(groupRouter)
const port = 3600 || process.env.PORT
app.listen(port)
console.log('Express server running on port', port)


