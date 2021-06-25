
const express = require('express')
const groupRouter = express.Router()
const path = require('path')
const { checkAuthenticated } = require('./authentication')

groupRouter.get('/covid-screening', checkAuthenticated, function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'covid-screening.html'))
})

groupRouter.get('/find-groups', checkAuthenticated, function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'find-groups.html'))
})

groupRouter.get('/recommended-groups', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'recommended-groups.html'))
})

groupRouter.get('/create-group', checkAuthenticated, function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'create-group.html'))
})

groupRouter.get('/choose-group', checkAuthenticated, function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'choose-group.html'))
})

module.exports = groupRouter
