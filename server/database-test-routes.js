const { resetUsers } = require('./loginRouter')

'use strict'

const express = require('express')
const path = require('path')
const db = require('./database-service')
const { clearPolls } = require('./polls/polls')

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

/* ---------------------------- Meeting Routes ---------------------------- */

// Clear all the non-permanent entries in the meetings table
testRouter.get('/clear-meetings', function (req, res) {
  // Make a query to the database
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        .query('DELETE FROM meetings WHERE meeting_id NOT IN (2, 3);')
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
/* ---------------------------- Screening Test Routes ---------------------------- */

// Clear all screening entries
testRouter.get('/delete-screening', function (req, res) {
  db.pools
    .then((pool) => {
      return pool.request()
        .query('DELETE FROM screening WHERE screening_id NOT IN (161, 162)')
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

// Determines that the correct value was entered into the screening table
testRouter.get('/screening', function (req, res) {
  db.pools
    .then((pool) => {
      return pool.request()
        .query(`select passed from screening
                where user_id = 4;`)
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

/* -------------------------------------------------------------------------- */

// Resets the ratings to the agreed start values
testRouter.get('/reset-ratings', function (req, res) {
  db.pools
    .then((pool) => {
      return pool.request()
        .query(`UPDATE users SET rating = CASE user_id
                      WHEN 4 THEN 5
                      WHEN 28 THEN 3.5
                      ELSE NULL 
                    END, 
                      number_ratings = CASE user_id
                      WHEN 4 THEN 1 
                      WHEN 28 THEN 2 
                      ELSE NULL
                  END; `)
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


/* -------------------------------------------------------------------------- */

testRouter.get('/clear-groups', function (req, res) {
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
    .query(`
        DELETE FROM invites WHERE group_id IN (SELECT group_id FROM groups WHERE group_name ='NewGroup1')
        DELETE FROM memberships WHERE group_id IN (SELECT group_id FROM groups WHERE group_name ='NewGroup1')
        DELETE FROM messages WHERE group_id IN (SELECT group_id FROM groups WHERE group_name='NewGroup1')
        DELETE FROM meetings WHERE group_id IN (SELECT group_id FROM groups WHERE group_name='NewGroup1')
        DELETE FROM action_log
        DELETE FROM groups WHERE (group_name ='NewGroup1')
        `)
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
  // Make a query to the database

// delete the users except for user_id=4 and user_id=5
testRouter.get('/clear-users', function (req, res) {
  // Make a query to the database

  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        .query('DELETE FROM users WHERE (user_id<>4 AND user_id<>5 AND user_id<>28 AND user_id<>34)')
    })
    // Send back the result
    .then(result => {
      res.send(result)
      resetUsers()
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

testRouter.get('/clear-polls', function (req, res) {
  // Make a query to the database

  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        .query(`DELETE FROM poll_stats;
        DELETE FROM polls;`)
    })
    // Send back the result
    .then(result => {
      res.send(result)
      clearPolls()
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

  // Yasser's
testRouter.get('/clear-new-group-requests', function (req, res) {
  // Make a query to the database
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        .query("DELETE FROM group_requests WHERE group_id IN (SELECT group_id FROM groups WHERE group_name ='NewGroup1')")
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
 // Basheq's
testRouter.get('/clear-requests', function (req, res) {
  // Make a query to the database

  const group_id = req.query.group_id

  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        .input('groupId', db.sql.Int, group_id)
        .query('DELETE FROM group_requests WHERE group_id=@groupId')
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

testRouter.get('/mock-request', function (req, res) {
  // Make a query to the database

  const group_id = req.query.group_id
  const user_id = req.query.user_id

  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        .input('userId', db.sql.Int, user_id)
        .input('groupId', db.sql.Int, group_id)
        .query(`INSERT INTO group_requests (user_id, group_id, time_sent)
        VALUES (@userId, @groupId, CURRENT_TIMESTAMP);`)
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

testRouter.get('/remove-user-from-group', function (req, res) {
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        .input('userId', db.sql.Int, req.query.user_id)
        .input('groupId', db.sql.Int, req.query.group_id)
        .query('DELETE FROM memberships WHERE group_id=@groupId AND user_id=@userId')
    })
    // Send back the result
    .then(result => {
      res.send(result)
      resetUsers()
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

testRouter.get('/add-user-to-group', function (req, res) {
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        .input('userId', db.sql.Int, req.query.user_id)
        .input('groupId', db.sql.Int, req.query.group_id)
        .query(`INSERT INTO memberships (group_id, user_id, date_joined) 
        VALUES (@groupId, @userId, CURRENT_TIMESTAMP)`)
    })
    // Send back the result
    .then(result => {
      res.send(result)
      resetUsers()
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

testRouter.get('/clear-invites', function (req, res) {
  // Make a query to the database

  const group_id = req.query.group_id
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        .input('groupId', db.sql.Int, group_id)
        .query('DELETE FROM invites WHERE group_id=@groupId')
    })
    // Send back the result
    .then(result => {
      res.send(result)
      resetUsers()
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})
  
testRouter.get('/get-user-invites-to-group', (req, res) => {
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        // Retrieve ALL invites for current user
        .input('user', db.sql.Char, req.query.userId)
        .input('group', db.sql.Char, req.query.groupId)
        .query(`
                SELECT invites.invite_id, groups.group_id, groups.group_name, groups.course_code, invites.time_sent
                FROM invites
                INNER JOIN groups ON invites.group_id=groups.group_id
                WHERE invites.receiver_id=@user AND invites.group_id=@group;
            `)
    })
    // Send back the result
    .then(result => {
      if (result.recordset) {
        res.send(result.recordset)
      } else {
        res.send(null)
      }
      // res.send(result)
    })
})

module.exports = testRouter
