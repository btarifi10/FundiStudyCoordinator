'use strict'

module.exports = function (app, passport) {
  // Import dependencies.
  const router = require('express').Router()
  const path = require('path')
  const bcrypt = require('bcrypt')
  const { UserService } = require('./user-service')
  const userService = UserService.getUserServiceInstance()

  let users = []

  function updateUsers () {
    userService.getAllUsers().then(
      data => {
        users = data
      }
    )
  }

  updateUsers()

  // Initialise Passport.js
  const initialisePassport = require('./passportConfig.js')
  initialisePassport(
    passport,
    username => users.find(user => user.username === username),
    id => users.find(user => user.userId === id)
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
      return res.json({ message: `Account with username ${req.body.username} already exists` })
    }

    try {
      // Use bcrypt to hash the password for security purposes.
      const hashPasswd = await bcrypt.hash(req.body.password, 7)

      const user = {
        username: req.body.username,
        user_password: hashPasswd,
        first_name: req.body.firstName,
        last_name: req.body.lastName
      }

      const success = await new Promise((resolve, reject) => {
        userService.addNewUser(user)
          .then(result => resolve(result))
      })

      if (success) {
        updateUsers()
        res.redirect('/login')
      } else {
        return res.send({ message: 'Failed to create user. Please try again' })
      }
    } catch {
      return res.send({ message: 'Failed to create user. Please try again' })
    }
  })

  // Post request to login - uses Passport.js for authentication
  // router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  //   successRedirect: '/dashboard',
  //   failureRedirect: '/login',
  //   failureFlash: true
  // }))

  router.post('/login', checkNotAuthenticated, function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
      if (err) { return next(err) }
      if (!user) {
        return res.send(info)
      }
      req.logIn(user, function (err) {
        if (err) { return next(err) }

        res.redirect('/dashboard')
      })
    })(req, res, next)
  })

  // Get dashboard if authenticated.
  router.get('/dashboard', checkAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'dashboard.html'))
  })

  // Retrieve current user details.
  router.get('/api/currentUser', checkAuthenticated, (req, res) => {
    res.json({
      userId: req.user.userId,
      username: req.user.username,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      rating: req.user.rating
    })
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
