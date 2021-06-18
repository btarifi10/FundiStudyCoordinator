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
app.use(express.json())
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

/* ----------------------------- Login Functonality ----------------------------- */

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

app.post('/create-screening', function (req, res) {
  const newScreen = req.body
  console.log(newScreen)
  // console.log(newScreen.user_id, newScreen.passed, newScreen.date)
  // Make a query to the database
  db.pools
    .then((pool) => {
      return pool.request()
        .input('userid', db.sql.Int, newScreen.user_id)
        .input('passed', db.sql.Bit, newScreen.passed)
        .input('date', db.sql.DateTimeOffset, newScreen.date)
        .query(`
        INSERT Into screening(user_id, passed,date_screened)
        VALUES (@userid, @passed, @date);
        `)
      // VALUES ((@userid), (@passed), (@date));
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

/* ----------------------------- Yasser's Code ----------------------------- */

// const db = require('./database-service')
const bodyParser = require('body-parser')
const { mainModule } = require('process')
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
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

app.get('/getUsersInGroup', function (req, res) {
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        .input('groupname', db.sql.Char, req.query.groupname)
        .query(`
        SELECT *
        FROM users AS u 
        INNER JOIN memberships AS m
            ON u.user_id = m.user_id
        INNER JOIN groups AS g
            ON g.group_id = m.group_id
        WHERE g.group_id IN (
        SELECT group_id 
        FROM groups
        WHERE group_name = (@groupname)
        )

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

app.get('/getUsersGroups', function (req, res) {
  console.log(req.query)
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        .input('username', db.sql.Char, req.query.username)
        .query(`
          SELECT group_name
          FROM groups AS g 
            INNER JOIN memberships AS m
                ON g.group_id = m.group_id
            INNER JOIN users AS u
                ON m.user_id = u.user_id
          WHERE u.user_id IN (
            SELECT user_id 
            FROM users
            WHERE username = (@username)
            )   
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

app.get('/getRequests', function (req, res) {
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        .input('username', db.sql.Char, req.query.username)
        .query(`
          SELECT group_name
          FROM groups AS g 
            INNER JOIN group_requests AS r
                ON g.group_id = r.group_id
            INNER JOIN users AS u
                ON r.user_id = u.user_id
          WHERE u.user_id IN (
            SELECT user_id 
            FROM users
            WHERE username = (@username)
            )   
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
  console.log('server-createGroup')
  // Make a query to the database
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        .input('group_name', db.sql.Char, newGroup.group_name)
        .input('course_code', db.sql.Char, newGroup.course_code)
        .input('date_created', db.sql.DateTimeOffset, newGroup.date_created)
        .query(`
          INSERT INTO groups (group_name, course_code, date_created)
          VALUES ((@group_name),(@course_code),(@date_created));        
        `)
    })
    // Send back the result
    .then(result => {
      res.send(result)
      console.log('done with createGroup ')
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

app.post('/createMembership', function (req, res) {
  const membershipInfo = req.body
  // Make a query to the database
  db.pools
    // Run query
    .then((pool) => {
      console.log('INSIDE server-createMembership carrying: ')
      console.log(membershipInfo)
      membershipInfo.members.forEach(member => {
        console.log(member)
        console.log(membershipInfo.group_name.trim())
        console.log(membershipInfo.date_created)
        return pool.request()
          .input('username', db.sql.Char, member)
          .input('group_name', db.sql.Char, membershipInfo.group_name.trim())
          .input('date_created', db.sql.DateTimeOffset, membershipInfo.date_created)
          .query(`
            INSERT INTO memberships (user_id, group_id, date_joined)
            SELECT user_id, group_id, (@date_created)
            FROM users AS u, groups AS g
            WHERE u.username = (@username)
            AND g.group_name = (@group_name);
          `)
      })
    })
    // Send back the result
    .then(result => {
      res.send(result)
      console.log('done with createMembership')
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

app.post('/sendInvites', function (req, res) {
  const inviteObj = req.body
  console.log(inviteObj)
  // console.log(inviteList)
  // Make a query to the database
  db.pools
    // Run query
    .then((pool) => {
      inviteObj.invited_members.forEach(member => {
        return pool.request()
          .input('username', db.sql.Char, member)
          .input('group_name', db.sql.Char, inviteObj.group_name)
          .input('time_sent', db.sql.DateTimeOffset, inviteObj.time_sent)
          .query(`
            INSERT INTO invites (receiver_id, group_id, time_sent)
            SELECT user_id, group_id, (@time_sent)
            FROM users AS u, groups AS g
            WHERE u.username = (@username)
            AND g.group_name = (@group_name);
          `)
      })
    })
    // Send back the result
    .then(result => {
      res.send(result)
      console.log('Invites have been sent')
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

app.post('/sendRequest', function (req, res) {
  const reqObj = req.body
  // console.log(inviteList)
  // Make a query to the database
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        .input('username', db.sql.Char, reqObj.username)
        .input('group_name', db.sql.Char, reqObj.group_name)
        .input('time_sent', db.sql.DateTimeOffset, reqObj.time_sent)
        .query(`
          INSERT INTO group_requests (user_id, group_id, time_sent)
          SELECT user_id, group_id, (@time_sent)
          FROM users AS u, groups AS g
          WHERE u.username = (@username)
          AND g.group_name = (@group_name);
        `)
    })
    // Send back the result
    .then(result => {
      res.send(result)
      console.log('Requests have been sent')
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})

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
      // retrieve all memberships recordsets for the specified user
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

const meetingRouter = require('./meeting-routes')
app.use(meetingRouter)

app.get('/profile', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'profile.html'))
})

app.get('/home', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'home.html'))
})

/* ----------------------------- Nathan's Code ----------------------------- */

// Temp router for choose location demonstration
app.get('/choose-location', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'choose-location.html'))
})

// Routing

const chatRouter = require('./group-chat/chat-routes')
app.use(chatRouter)

// Chat Service

// Run when a member enters the group
io.on('connection', socket => {
  // Chats
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
