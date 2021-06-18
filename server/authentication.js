'use strict'

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

module.exports = { checkAuthenticated, checkNotAuthenticated }
