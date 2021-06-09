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
const handleChatMember = require('./chat-server')

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

/* ----------------------------- Yasser's Code ----------------------------- */

app.get('/intermediate-group', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'intermediate-group.html'))
})

app.get('/createGroup', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'create-join-group.html'))
})

/* ----------------------------- Tarryn's Code ----------------------------- */
const id = 2;
console.log(id)

const db = require('./database-service')
// this currently gives errors, used 
// app.post('/insertINTOdatabase', (request, response) => { 
//   const {user_id,group_id,date_joined} = request.body;
//   const query = "INSERT INTO memberships (user_id, group_id, date_joined) VALUES (?,?,?)";
//   db.pools
//     .then((pool) =>{
//       return pool.request()
//         .query(query, [user_id,group_id, date_joined])
//         //.query('INSERT INTO memberships (user_id, group_id, date_joined) VALUES (2,1,2021-06-08 08:52:23)')//, ['1','1','2021-06-08 08:52:23'])
//     })
//     .then(result => {
//       response.send(result)
//       //console.log(result)
//     })
// })

app.get('/profileViews/:id', (req, res) => {
  const {id} = req.params
  // Make a query to the database
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        // retrieve all recordsets with the following information to be displayed on the profile page
        // want to retrieve the specific users personal details
        .query(`SELECT * FROM users WHERE users.user_id = (${id})`)
    })
    // Send back the result
    .then(result => {
      res.send(result)
      //console.log(result)
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
  const {id} = req.params
  // Make a query to the database
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        // retrieve all recordsets with the following information to be displayed on the profile page

        // want to retrieve the specific users personal details
        // then search the memberships table for the entries corresponding to the user_id
        // retrieve the groups that correspond to the user_id in the memberships table
        .query(`SELECT date_joined, memberships.group_id, group_name FROM memberships INNER JOIN groups ON memberships.group_id=groups.group_id WHERE (${id}) = memberships.user_id`)
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

// TODO - Add proper routing files
app.get('/chat', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'chat.html'))
})

// TODO - Add proper routing files
app.get('/intermediate-chat', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'intermediate-chat.html'))
})

// Chat Service

// Run when a member enters the group
io.on('connection', socket => {
  handleChatMember(io, socket)
})

/* ----------------------------- Database Test ----------------------------- */

//const db = require('./database-service')
/*
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
      res.send(result)
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.send({
        Error: err
      })
    })
})*/

const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
