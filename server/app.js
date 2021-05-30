'use strict'

const express = require('express')
const path = require('path')

const app = express()
app.use(express.urlencoded({ extended: false }))

const router = express.Router()
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use('/', router)

// const users = []

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'homepage.html'))
})

router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'registration.html'))
})

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'login.html'))
})

const port = 6969
app.listen(port)
console.log('Express server running on port', port)
