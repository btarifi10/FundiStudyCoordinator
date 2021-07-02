'use strict'

/* ------------------------------ Requirements ------------------------------ */

// const formatMessage = require('../public/scripts/group-chat/chat-messages')
const {
  addChatMember,
  getCurrentMember,
  removeChatMember,
  getChatMembers
} = require('./chat-members')

/* ------------------------------- CONSTANTS ------------------------------- */

// const BOT_NAME = 'Study Bot'
const JOIN_CHAT_EVENT = 'joinChat'
const MESSAGE_EVENT = 'message'
const CHAT_MESSAGE_EVENT = 'chatMessage'
const GROUP_INFO_EVENT = 'groupInfo'

/* ---------------------------- Public Functions ---------------------------- */

function handleChatMember (io, socket) {
  socket.on(JOIN_CHAT_EVENT, ({ username, group }) => {
    handleJoinEvent(io, socket, username, group)
  })

  socket.on(CHAT_MESSAGE_EVENT, (message) => {
    handleChatMessage(io, socket, message)
  })

  socket.on('disconnect', () => {
    handleDisconnect(io, socket)
  })
  socket.on('notification', ({ group, message }) => {
    io.to(group).emit(MESSAGE_EVENT, message)
  })
}

/* --------------------------- Private Functions --------------------------- */

function handleJoinEvent (io, socket, username, group) {
  // Add the member to the group chat
  const member = addChatMember(socket.id, username, group)
  socket.join(member.group)

  // TODO - display welcome message only when member joins group for the first time
  // Welcome the member that has just joined
  // const welcomeText = `Hey ${member.username}! Welcome to the ${member.group} group chat!`
  // const welcomeMessage = formatMessage(BOT_NAME, welcomeText)
  // socket.emit(MESSAGE_EVENT, welcomeMessage)

  // TODO - display join message only when member joins group for the first time
  // Notify the other members in the group of the new member's arrival
  // const joinText = `${member.username} has joined the chat!`
  // const joinMessage = formatMessage(BOT_NAME, joinText)
  // socket.broadcast.to(member.group).emit(MESSAGE_EVENT, joinMessage)

  // Send the updated list of chat members to be rendered on the client
  io.to(member.group).emit(GROUP_INFO_EVENT, {
    group: member.group,
    members: getChatMembers(member.group)
  })
}

function handleChatMessage (io, socket, message) {
  // Retrieve the member who sent the message using their socket id
  const member = getCurrentMember(socket.id)
  // Send this message to all members in this member's group chat
  io.to(member.group).emit(MESSAGE_EVENT, message)
}

function handleDisconnect (io, socket) {
  // Find and remove the member using their socket id
  const member = removeChatMember(socket.id)

  // Continue only if a member is found
  if (!member) { return }

  // TODO - display leaving message only when member leaves group
  // const leavingText = `${member.username} has left the chat...`
  // const leavingMessage = formatMessage(BOT_NAME, leavingText)
  // io.to(member.group).emit(MESSAGE_EVENT, leavingMessage)

  // Send the updated list of chat members to be rendered on the client
  io.to(member.group).emit(GROUP_INFO_EVENT, {
    group: member.group,
    members: getChatMembers(member.group)
  })
}

module.exports = handleChatMember
