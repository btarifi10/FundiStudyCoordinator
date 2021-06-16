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

const db = require('./database-service')
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
        .input('date_created', db.sql.DateTimeOffset, newGroup.date_created)
        .query(`
          INSERT INTO groups (group_name, course_code, date_created)
          VALUES ((@group_name),(@course_code),(@date_created));
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

app.post('/createMembership', function (req, res) {
  const membershipInfo = req.body
  // console.log(newGroup)
  // Make a query to the database
  db.pools
    // Run query
    .then((pool) => {
      membershipInfo.members.forEach(member => {
        member = 
      })
      
      return pool.request()
      
        .input('username', db.sql.Char, membershipInfo.username)
        .input('groupname', db.sql.Char, membershipInfo.group_name)
        .input('date_created', db.sql.DateTimeOffset, membershipInfo.date_created)
        .query(`
          INSERT INTO groups (group_name, course_code, date_created)
          VALUES ((@group_name),(@course_code),(@date_created));
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

app.post('/insert', (request, response) => { })

const GROUPS = [
  {
    group_id: '1',
    group_name: 'Phantom Menace',
    date_joined: new Date('1999'),
    group_num: '6',
    group_url: 'PM.html',
    group_online: '4'
  },
  {
    group_id: '2',
    group_name: 'Attack of the Clones',
    date_joined: new Date('2002'),
    group_num: '6',
    group_url: 'AC.html',
    group_online: '4'
  },
  {
    group_id: '3',
    group_name: 'Revenge of the Sith',
    date_joined: new Date('2005'),
    group_num: '6',
    group_url: 'RS.html',
    group_online: '4'
  },
  {
    group_id: '4',
    group_name: 'A New Hope',
    date_joined: new Date('1977'),
    group_num: '6',
    group_url: 'ANH.html',
    group_online: '4'
  },
  {
    group_id: '5',
    group_name: 'The Empire Strikes Back',
    date_joined: new Date('1980'),
    group_num: '6',
    group_url: 'ESB.html',
    group_online: '4'
  },
  {
    group_id: '6',
    group_name: 'Return of the Jedi',
    date_joined: new Date('1983'),
    group_num: '6',
    group_url: 'RJ.html',
    group_online: '4'
  }
]

// read user database entry - called when the page is loaded
app.get('/getAll', (request, response) => {
  response.json(GROUPS)
  // console.log('test');
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

// const db = require('./database-service')

// app.get('/database', function (req, res) {
// // Make a query to the database
// db.pools
//   // Run query
//   .then((pool) => {
//     return pool.request()
//       // This is only a test query, change it to whatever you need
//       .query('SELECT * FROM users')
//   })
//   // Send back the result
//   .then(result => {
//     res.send(result)// Send this back to the web page?
//     console.log(result)
//   })
//   // If there's an error, return that with some description
//   .catch(err => {
//     res.send({
//       Error: err
//     })
//   })
// })

const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
