'use strict'

/* ------------------------------ Requirements ------------------------------ */

// Use dotenv for environmental variables if not in production.
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// Import express, passport and other dependencies.
// Passport.js is often used for authentication and maintaining sessions:
// Check out http://www.passportjs.org/docs/ for more info.
const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const handleChatMember = require('./group-chat/chat-server')
const { handleVoting } = require('./polls/polling-service')
/* ----------------------------- Initial Setup ----------------------------- */

const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_ID,
  resave: false,
  saveUninitialized: false
}))
app.use(express.static(path.join(__dirname, '..', 'public')))
const server = http.createServer(app)
const io = socketio(server)

/* ----------------------------- Basheq's Code ----------------------------- */

// Use the loginRouter for the login and register functionality.
const loginRouter = require('./loginRouter.js')(app, passport)
app.use('/', loginRouter)

/* ----------------------------- Taliya's Code ----------------------------- */

const groupRouter = require('./group-routes')
app.use(groupRouter)

const db = require('./database-service')

app.delete('/delete/:membership_id', (request, response) => {
  const { membership_id } = request.params
  db.pools
    .then((pool) => {
      return pool.request()
        .input('membership_id', db.sql.Int, membership_id)
        .query('DELETE FROM memberships WHERE memberships.membership_id = @membership_id')
    })
    .then(result => {
      response.json({ success: result })
    })
})

app.get('/get-groups', function (req, res) {
  // Make a query to the database
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        // This is only a test query, change it to whatever you need
        .query('SELECT group_name FROM groups')
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

/* ----------------------------- Yasser's Code ----------------------------- */

// const db = require('./database-service')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/intermediate-group', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'intermediate-group.html'))
})

app.get('/createGroup', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'create-join-group.html'))
  // Add code here to get stuff from the database
})

app.use(express.json())

app.get('/get-users', function (req, res) {
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        .input('username', db.sql.Char, req.query.username)
        .query(`
          SELECT user_id, username 
          FROM users
          WHERE username <> (@username)
          ORDER BY username ASC;     
        `)
    })
    // Send back the result
    .then(result => {
      res.send(result)
      // console.log(result)
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

app.get('/get-groups', function (req, res) {
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        .input('username', db.sql.Char, req.query.username)
        .query(`
          SELECT group_name, course_code, date_created 
          FROM groups
          ORDER BY date_created ASC;     
        `)
    })
    // Send back the result
    .then(result => {
      res.send(result)
      // console.log(result)
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

app.post('/createGroup', function (req, res) {
  const newGroup = req.body
  // console.log(newGroup)
  // Make a query to the database
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        .input('group_name', db.sql.Char, newGroup.group_name)
        .input('course_code', db.sql.Char, newGroup.course_code)
        .input('start_date', db.sql.DateTimeOffset, newGroup.start_date)
        .query(`
          INSERT INTO groups (group_name, course_code, date_created)
          VALUES ((@group_name),(@course_code),(@start_date));
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

// app.post('/sendInvites', function (req, res) {
//   const inviteList = req.body
//   // console.log(newGroup)
//   // Make a query to the database
//   db.pools
//     // Run query
//     .then((pool) => {
//       return pool.request()
//         .input('group_name', db.sql.Char, newGroup.group_name)
//         .input('course_code', db.sql.Char, newGroup.course_code)
//         .input('start_date', db.sql.DateTimeOffset, newGroup.start_date)
//         .query(`
//           INSERT INTO groups (group_name, course_code, date_created)
//           VALUES ((@group_name),(@course_code),(@start_date));
//         `)
//     })
//     // Send back the result
//     .then(result => {
//       res.send(result)
//     })
//     // If there's an error, return that with some description
//     .catch(err => {
//       res.send({
//         Error: err
//       })
//     })
// })

/* ----------------------------- Tarryn's Code ----------------------------- */
app.get('/profileViews/:id', (req, res) => {
  const { id } = req.params
  // Make a query to the database
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        // retrieve all recordsets with the following information to be displayed on the profile page
        // want to retrieve the specific users personal details
        .input('id', db.sql.Int, id)
        .query('SELECT * FROM users WHERE users.user_id = (@id)')
    })
    // Send back the result
    .then(result => {
      res.send(result)
      // console.log(result)
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

app.get('/membershipViews/:id', function (req, res) {
  // save the currentUser ID as a variable to use in the select query
  const { id } = req.params
  // Make a query to the database
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
      // retrieve all recordsets with the following information to be displayed on the profile page

        // want to retrieve the specific users personal details
        // then search the memberships table for the entries corresponding to the user_id
        // retrieve the groups that correspond to the user_id in the memberships table
        .input('id', db.sql.Int, id)
        .query('SELECT membership_id, date_joined, memberships.group_id, group_name FROM memberships INNER JOIN groups ON memberships.group_id=groups.group_id WHERE (@id) = memberships.user_id')
    })
    // Send back the result
    .then(result => {
      res.send(result)
      console.log(result)
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

app.get('/profile', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'profile.html'))
})

app.get('/home', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'home.html'))
})

/* ----------------------------- Nathan's Code ----------------------------- */

// Routing

const chatRouter = require('./group-chat/chat-routes')
app.use(chatRouter)

// Chat Service

// Run when a member enters the group
io.on('connection', socket => {
  handleChatMember(io, socket)

  // Voting
  handleVoting(io, socket)
})

/* ----------------------------- Database Test ----------------------------- */

/*
const db = require('./database-service')

app.get('/database', function (req, res) {
  // Make a query to the database
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        // This is only a test query, change it to whatever you need
        .query('SELECT * FROM users')
    })
    // Send back the result
    .then(result => {
      // console.log(result)
      res.send(result.recordset)
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})
*/

/* ------------------------------ Invites: Basheq ---------------------------------- */

const profileRouter = require('./profile-router')
app.use('/', profileRouter)

/* ------------------------------- Polls -------------------------------------- */
const { pollingRouter } = require('./polls/polling-routes')
app.use(pollingRouter)

/* ------------------------------------------------------------------------- */

const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
