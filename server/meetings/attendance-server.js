'use strict'

/* ------------------------------ Requirements ------------------------------ */
const moment = require('moment')
const {
  addMember,
  getCurrentMember,
  removeMember,
  getAllMembers,
  changeMemberPosition
} = require('./attendance-members')

/* ------------------------------- CONSTANTS ------------------------------- */
const SERVER_MESSAGE = 'Mmessage'
const BOT_NAME = 'Study Bot'
const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
let labelIndex = 0
/* ---------------------------- Public Functions ---------------------------- */

function handleMeetingMember (io, socket) {
  socket.on('joinMeeting', ({ username, group, meetingID, position }) => {
    handleJoinEvent(io, socket, username, group, meetingID, position)
  })

  socket.on('meetingMessage', (message) => {
    handleChatMessage(io, socket, message)
  })

  socket.on('changePosition', ({ newPosition }) => {
    handleLocation(io, socket, newPosition)
  })

  socket.on('arrived', (check) => {
    handleArrival(socket, check)
  })

  socket.on('disconnect', () => {
    handleDisconnect(io, socket)
  })

  socket.on('receivePosition', () => {
    const member = getCurrentMember(socket.id)
    const pos = member.position
    socket.emit('sendPosition', pos)
  })

  setInterval(function () {
    socket.emit('news-by-server')
  }, 120000) // request every 2min
}

function handleArrival (socket, check) {
  const member = getCurrentMember(socket.id)
  let arrivalText = ''
  if (check == true) {
    arrivalText = `${member.username} has arrived safely at their destination!`
  } else if (check == false) {
    arrivalText = `${member.username} has stopped sharing their location!`
  }
  const joinMessage = formatMessage(BOT_NAME, arrivalText)
  socket.broadcast.to(member.group).emit(SERVER_MESSAGE, joinMessage)
}

/* --------------------------- Private Functions --------------------------- */

function handleJoinEvent (io, socket, username, group, meetingID, position) {
  // Add the member to the group chat
  const label = labels[labelIndex++ % labels.length]
  const member = addMember(socket.id, username, group, meetingID, position, label)
  socket.join(member.group)

  // Since the meetings attendance pages are non-persistent, these messages
  // are sent every time a user joins the meeting
  // Welcome the member that has just joined
  const welcomeText = `Welcome ${member.username}! By being in this chat you have confirmed your attendance to the meeting for ${member.group}!`
  const welcomeMessage = formatMessage(BOT_NAME, welcomeText)
  socket.emit(SERVER_MESSAGE, welcomeMessage)

  // Notify the other members in the group of the new member's arrival
  const joinText = `${member.username} has joined the chat!`
  const joinMessage = formatMessage(BOT_NAME, joinText)
  socket.broadcast.to(member.group).emit(SERVER_MESSAGE, joinMessage)

  // Send the updated list of chat members to be rendered on the client
  io.to(member.group).emit('meetingInfo', {
    group: member.group,
    members: getAllMembers(member.group)
  })
}

function handleChatMessage (io, socket, message) {
  // Retrieve the member who sent the message using their socket id
  const member = getCurrentMember(socket.id)
  // Send this message to all members in this member's group chat
  io.to(member.group).emit(SERVER_MESSAGE, message)
}

function handleLocation (io, socket, newPosition) {
  changeMemberPosition(socket.id, newPosition)

  const member = getCurrentMember(socket.id)

  io.to(member.group).emit('meetingInfo', {
    group: member.group,
    members: getAllMembers(member.group)
  })
}

function handleDisconnect (io, socket) {
  // Find and remove the member using their socket id
  const member = removeMember(socket.id)

  // Continue only if a member is found
  if (!member) { return }

  const leavingText = `${member.username} has left the meeting...`
  const time = moment()
  const leavingMessage = formatMessage(BOT_NAME, leavingText, time)
  io.to(member.group).emit(SERVER_MESSAGE, leavingMessage)

  // Send the updated list of chat members to be rendered on the client
  io.to(member.group).emit('meetingInfo', {
    group: member.group,
    members: getAllMembers(member.group)
  })
}

// Returns a message object containing the member's username, text and timestamp
function formatMessage (username, text, time) {
  return {
    username: username,
    text: text,
    time: moment(time).format('HH:mm')
  }
}

module.exports = handleMeetingMember
