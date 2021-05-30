'use strict'

/* ------------------------------ Requirements ------------------------------ */

const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const {
  addChatMember,
  getCurrentMember,
  removeChatMember,
  getChatMembers
} = require('./utils/members')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

/* ------------------------------- CONSTANTS ------------------------------- */

const BOT_NAME = 'Study Bot'
const JOIN_CHAT_EVENT = 'joinChat'
const MESSAGE_EVENT = 'message'
const CHAT_MESSAGE_EVENT = 'chatMessage'
const GROUP_INFO_EVENT = 'groupInfo'

/* -------------------------------- Routing -------------------------------- */

app.use(express.static(path.join(__dirname, 'public')))

// TODO - Temp router for chat.html (ADD ROUTING FILES)
app.get('/chat', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'chat.html'))
})

// TODO - Temp router for index.html (ADD ROUTING FILES)
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
})

/* ------------------------------ Chat Service ------------------------------ */

// Run when a member enters the group
io.on('connection', socket => {
  socket.on(JOIN_CHAT_EVENT, ({ username, group }) => {
    // Add the member to the group chat
    const member = addChatMember(socket.id, username, group)
    socket.join(member.group)

    // Welcome the member that has just joined
    const welcomeText = `Hey ${member.username}! Welcome to the ${member.group} group chat!`
    const welcomeMessage = formatMessage(BOT_NAME, welcomeText)
    socket.emit(MESSAGE_EVENT, welcomeMessage)

    // Notify the other members in the group of the new member's arrival
    const joinText = `${member.username} has joined the chat!`
    const joinMessage = formatMessage(BOT_NAME, joinText)
    socket.broadcast.to(member.group).emit(MESSAGE_EVENT, joinMessage)

    // Send the updated list of chat members to be rendered on the client
    io.to(member.group).emit(GROUP_INFO_EVENT, {
      group: member.group,
      members: getChatMembers(member.group)
    })
  })

  // Listen for chat messages
  socket.on(CHAT_MESSAGE_EVENT, (message) => {
    // Retrieve the member who sent the message using their socket id
    const member = getCurrentMember(socket.id)

    // Send this message to all members in this member's group chat
    io.to(member.group).emit(MESSAGE_EVENT, formatMessage(member.username, message))
  })

  // Run when the member leaves the group
  socket.on('disconnect', () => {
    // Find and remove the member using their socket id
    const member = removeChatMember(socket.id)

    // If a member was found, display the leaving message to the others in the chat
    if (member) {
      const leavingText = `${member.username} has left the chat...`
      const leavingMessage = formatMessage(BOT_NAME, leavingText)
      io.to(member.group).emit(MESSAGE_EVENT, leavingMessage)

      // Send the updated list of chat members to be rendered on the client
      io.to(member.group).emit(GROUP_INFO_EVENT, {
        group: member.group,
        members: getChatMembers(member.group)
      })
    }
  })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
