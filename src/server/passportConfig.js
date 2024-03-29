'use strict'

// Initialises Authentication procedure for Passport.js using Local Strategy.
// See http://www.passportjs.org/docs/ for more information.
// Bcrypt is used for password hashing.
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialise (passport, getUserByUsername, getUserById) {
  const authenticateUser = async (username, password, done) => {
    const user = getUserByUsername(username)

    if (user == null) {
      return done(null, false, { message: `No account created for ${username}` })
    }

    try {
      if (await bcrypt.compare(password, user.userPassword)) { return done(null, user) } else {
        return done(null, false, { message: 'Password Incorrect' })
      }
    } catch (error) {
      return done(error)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser))

  passport.serializeUser((user, done) => { return done(null, user.userId) })
  passport.deserializeUser((id, done) => { return done(null, getUserById(id)) })
}

module.exports = initialise
