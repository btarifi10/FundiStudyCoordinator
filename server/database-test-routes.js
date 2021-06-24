const { clearUsersExcept } = require('./loginRouter')

'use strict'

const express = require('express')
const path = require('path')
const db = require('./database-service')

const testRouter = express.Router()
testRouter.use(express.json())

/* ---------------------------- Chat Test Routes ---------------------------- */

// Clear all the entries in the message table
testRouter.get('/clear-messages', function (req, res) {
  // Make a query to the database
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        .query('DELETE FROM messages')
    })
    // Send back the result
    .then(result => {
      res.send(result)
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

/* -------------------------------------------------------------------------- */

// delete the groups added except for group_id = 6

// delete the users except for user_id=4 and user_id=5
testRouter.get('/clear-users', function (req, res) {
  // Make a query to the database

  clearUsersExcept([4, 5])

  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        .query('DELETE FROM users WHERE user_id<>4 AND user_id<>5')
    })
    // Send back the result
    .then(result => {
      res.send(result)
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

module.exports = testRouter
