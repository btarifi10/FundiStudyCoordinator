// This file contains all the current group
// Once database is built these hardcoded paths will be configured to be linked to pages from server

const express = require('express')
const groupRouter = express.Router()
const path = require('path')

groupRouter.get('/covid-screening', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'covid-screening.html'))
})

groupRouter.get('/find-groups', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'find-groups.html'))
})

groupRouter.get('/create-group', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'create-group.html'))
})

groupRouter.get('/big-data', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'big-data.html'))
})

groupRouter.get('/software', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'software.html'))
})

groupRouter.get('/sociology', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'sociology.html'))
})

groupRouter.get('/choose-group', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'choose-group.html'))
})

module.exports = groupRouter
