'use strict'

const LocalStrategy = require('passport-local').Strategy

function initialise (passport, getUserByUsername, getUserById) {
  const authenticateUser = (username, password, done) => {
    const user = getUserByUsername(username)

    if (user === null) {
      return done(null, false, { message: `No account created for ${username}` })
    }
    if (user.password === password) {
      return done(null, user)
    } else {
      return done(null, false, { message: 'Password Incorrect' })
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser))

  passport.serializeUser((user, done) => { return done(null, user.id) })
  passport.deserializeUser((id, done) => { return done(null, getUserById(id)) })
}

module.exports = initialise
