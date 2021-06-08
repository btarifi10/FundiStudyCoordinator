'use strict'

const express = require('express')
const path = require('path')

const chatRouter = express.Router()

// Routes

chatRouter.get('/chat', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'chat.html'))
})

chatRouter.get('/intermediate-chat', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'intermediate-chat.html'))
})

module.exports = chatRouter
