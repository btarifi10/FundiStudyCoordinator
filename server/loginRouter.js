'use strict'

module.exports = function (app, passport) {
  // Import dependencies.
  const router = require('express').Router()
  const express = require('express')
  router.use(express.json())
  const path = require('path')
  const bcrypt = require('bcrypt')
  const { UserService } = require('./user-service')
  const userService = UserService.getUserServiceInstance()
  const db = require('./database-service')

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
      console.log('existing')
      return res.redirect('/register')
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

      console.log(user)

      const success = await new Promise((resolve, reject) => {
        userService.addNewUser(user)
          .then(result => resolve(result))
      })

      if (success) {
        updateUsers()
        res.redirect('/login')
      } else {
        res.redirect('/register')
      }
    } catch {
      res.redirect('/register')
    }
  })

  // Updates the ratings of the newly rated individual
  router.post('/update-ranking', function (req, res) {
    // updateUserRating(req.body.userName, req.body.newRating)
    db.pools
      .then((pool) => {
        return pool.request()
          .input('ranking', db.sql.Float, req.body.newRating)
          .input('number_ranking', db.sql.Int, req.body.newNumberRanking)
          .input('username', db.sql.Char, req.body.userName)
          .query(`UPDATE users set rating = @ranking, number_ratings = @number_ranking
          where username= @username;`)
      })
      .then(result => {
        res.send(result)
      })
      .catch(err => {
        res.send({
          Error: err
        })
      })
  })

  // function updateUserRating (userAffected, newRating) {
  //   users = []
  //   userService.getAllUsers().then(
  //     data => {
  //       users = data
  //       if (users.userName == userAffected) {
  //         users.rating = newRating
  //       }
  //     }
  //   )
  // }

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
    console.log(req.user)
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
