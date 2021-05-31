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

  router.get('/register', checkNotAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'registration.html'))
  })

  router.get('/login', checkNotAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'))
  })

  router.post('/register', checkNotAuthenticated, (req, res) => {
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

  router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: true
  }))

  router.get('/dashboard', checkAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'dashboard.html'))
  })

  router.get('/api/currentUser', (req, res) => {
    res.json({ id: req.user.id, username: req.user.username })
  })

  router.post('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
  })

  function checkNotAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/dashboard')
    }

    return next()
  }

  function checkAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }

    return res.redirect('/')
  }

  return router
}
