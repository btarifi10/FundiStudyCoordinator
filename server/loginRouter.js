'use strict'

const express = require('express')
const router = express.Router()
const path = require('path')

const users = []

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'homepage.html'))
})

router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'registration.html'))
})

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'login.html'))
})

router.post('/register', (req, res) => {
  const username = req.body.username
  users.push(username)
  console.log(users)
  res.redirect(req.baseUrl)
})

router.post('/login', (req, res) => {
  const username = req.body.username
  if (users.includes(username)) {
    console.log('success')
  } else { console.log('user not found') }
  res.redirect(req.baseUrl)
})

module.exports = router
