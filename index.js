'use strict'

/* ------------------------------ Requirements ------------------------------ */

const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const handleChatMember = require('./utils/chat-server')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

/* -------------------------------- Routing -------------------------------- */

app.use(express.static(path.join(__dirname, 'public')))

// TODO - Add proper routing files
app.get('/chat', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'chat.html'))
})

// TODO - Add proper routing files
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
})

/* ------------------------------ Chat Service ------------------------------ */

// Run when a member enters the group
io.on('connection', socket => {
  handleChatMember(io, socket)
})

/* -------------------------------------------------------------------------- */

const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
