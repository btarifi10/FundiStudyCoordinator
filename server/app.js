'use strict'

const express = require('express')
const path = require('path')

const app = express()
app.use(express.urlencoded({ extended: false }))

const router = express.Router()
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use('/', router)

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

const port = 6969
app.listen(port)
console.log('Express server running on port', port)
