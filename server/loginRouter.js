'use strict'

module.exports = function (app, passport) {
  const router = require('express').Router()
  const path = require('path')

  const users = []

  const initialisePassport = require('./passportConfig.js')
  initialisePassport(
    passport,
    username => users.find(user => user.username === username),
    id => users.find(user => user.id === id)
  )

  app.use(passport.initialize())
  app.use(passport.session())

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
    const password = req.body.password
    users.push({
      id: users.length,
      username: username,
      password: password
    })

    console.log(users)
    res.redirect('/login')
  })

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: true
  }))

  return router
}
