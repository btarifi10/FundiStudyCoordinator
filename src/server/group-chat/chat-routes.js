'use strict'

const express = require('express')
const path = require('path')
const db = require('../database-service')

const chatRouter = express.Router()
chatRouter.use(express.json())

/* ------------------------------ Page Routes ------------------------------ */

chatRouter.get('/chat', function (req, res) {
  res.sendFile(path.join(__dirname, '..', '..', '..', 'views', 'chat.html'))
})

chatRouter.get('/intermediate-chat', function (req, res) {
  res.sendFile(path.join(__dirname, '..', '..', '..', 'views', 'intermediate-chat.html'))
})

chatRouter.get('/rating', function (req, res) {
  res.sendFile(path.join(__dirname, '..', '..', '..', 'views', 'rating.html'))
})

chatRouter.get('/view-log', function (req, res) {
  res.sendFile(path.join(__dirname, '..', '..', '..', 'views', 'view-log.html'))
})

/* ---------------------------- Database Routes ---------------------------- */

chatRouter.get('/get-chat', function (req, res) {
  // Make a query to the database
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        .input('group', db.sql.Char, req.query.group)
        .query(`
          SELECT username, text_sent, time_sent 
          FROM users AS u INNER JOIN messages AS m
            ON u.user_id = m.user_id
          WHERE m.group_id IN (
            SELECT group_id
            FROM groups
            WHERE group_name = (@group))
          ORDER BY time_sent ASC;
        `)
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

chatRouter.post('/record-message', function (req, res) {
  // Retrieve the message data
  const message = req.body

  // Make a query to the database
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        .input('username', db.sql.Char, message.username)
        .input('group', db.sql.Char, message.group)
        .input('text', db.sql.Char, message.text)
        .input('time', db.sql.DateTimeOffset, message.time)
        .query(`
          INSERT INTO messages (user_id, group_id, text_sent, time_sent)
          SELECT user_id, group_id, (@text), (@time)
          FROM users AS u, groups AS g
          WHERE u.username = (@username)
          AND g.group_name = (@group);
        `)
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

module.exports = chatRouter
