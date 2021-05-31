const express = require('express')
const groupRouter = express.Router()
const path = require('path')


groupRouter.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'big-data.html'))
//   res.sendFile('./views/big-data.html', { root: __dirname })
})

groupRouter.get('/software', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'software.html'))
})

groupRouter.get('/sociology', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'sociology.html'))
})

module.exports = groupRouter
