'use strict'

module.exports = function (app, passport) {
  // Import dependencies.
  const router = require('express').Router()
  const path = require('path')
  const bcrypt = require('bcrypt')

  // TODO: Replace hardcoded users with database (and database service).
  const users = []

  // Initialise Passport.js
  const initialisePassport = require('./passportConfig.js')
  initialisePassport(
    passport,
    username => users.find(user => user.username === username),
    id => users.find(user => user.id === id)
  )
  app.use(passport.initialize())
  app.use(passport.session())

  // Get homepage
  router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'homepage.html'))
  })

  // Get registration page
  router.get('/register', checkNotAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'registration.html'))
  })

  // Get login page
  router.get('/login', checkNotAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'))
  })

  // Post request to create user - checks if user is authenticated and if username already exists
  router.post('/register', checkNotAuthenticated, async (req, res) => {
    if (users.findIndex(user => user.username === req.body.username) >= 0) {
      return res.redirect('/register')
    }

    try {
      // Use bcrypt to hash the password for security purposes.
      const hashPasswd = await bcrypt.hash(req.body.password, 7)
      users.push({
        id: users.length,
        username: req.body.username,
        password: hashPasswd
      })
      console.log(users)
      res.redirect('/login')
    } catch {
      res.redirect('/register')
    }
  })

  // Post request to login - uses Passport.js for authentication
  router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: true
  }))

  // Get dashboard if authenticated.
  router.get('/dashboard', checkAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'dashboard.html'))
  })

  // Retrieve current user details.
  router.get('/api/currentUser', checkAuthenticated, (req, res) => {
    res.json({ id: req.user.id, username: req.user.username })
  })

  // Log out.
  router.post('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
  })

  // Checks if request is made from an authenticated user and either allows the request or redirects.
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

  // Export router.
  return router
}
