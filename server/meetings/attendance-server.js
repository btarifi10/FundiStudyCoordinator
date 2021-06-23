'use strict'

/* ------------------------------ Requirements ------------------------------ */

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
const markers = []
/* ---------------------------- Public Functions ---------------------------- */

function handleMeetingMember (io, socket) {
  socket.on('joinMeeting', ({ username, group, meetingID, position }) => {
    handleJoinEvent(io, socket, username, group, meetingID, position)
    // for (let i = 0; markers.length > 1; i++) {
    //   socket.emit('marker', markers[i])
    // }
  })

  socket.on('meetingMessage', (message) => {
    handleChatMessage(io, socket, message)
  })

  // socket.on('marker', (data) => {
  //   markers.push(data)
  //   // io.to(member.group).emit("marker", data)
  //   const member = getCurrentMember(socket.id)
  //   io.to(member.group).emit('marker', data)
  // })

  socket.on('changePosition', ({ username, group, meetingID, newPosition }) => {
    handleLocation(io, socket, newPosition)
  })

  socket.on('disconnect', () => {
    handleDisconnect(io, socket)
  })

  setInterval(function () {
    socket.emit('news-by-server', 'Searching location')
  }, 10000)
}

/* --------------------------- Private Functions --------------------------- */

function handleJoinEvent (io, socket, username, group, meetingID, position) {
  // Add the member to the group chat
  const label = labels[labelIndex++ % labels.length]
  const member = addMember(socket.id, username, group, meetingID, position, label)
  socket.join(member.group)

  // TODO - display welcome message only when member joins group for the first time
  // Welcome the member that has just joined
  const welcomeText = `Hey ${member.username}! ${member.position.lat},${member.position.lng} 
  By being in this chat you have indicated your attendance to the meeting for ${member.group}!`
  const welcomeMessage = formatMessage(BOT_NAME, welcomeText)
  socket.emit(SERVER_MESSAGE, welcomeMessage)

  // TODO - display join message only when member joins group for the first time
  // Notify the other members in the group of the new member's arrival
  const joinText = `${member.username} has joined the chat!`
  const joinMessage = formatMessage(BOT_NAME, joinText)
  socket.broadcast.to(member.group).emit(SERVER_MESSAGE, joinMessage)

  // Send the updated list of chat members to be rendered on the client
  io.to(member.group).emit('meetingInfo', {
    group: member.group,
    members: getAllMembers(member.group),
    markers: markers
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
  // const member = addMember(socket.id, username, group, meetingID, newPosition)
  // Send the updated list of chat members to be rendered on the client
  // addMember
  // socket.join(member.group)
  io.to(member.group).emit('meetingInfo', {
    group: member.group,
    members: getAllMembers(member.group),
    markers: markers
  })
}

function handleDisconnect (io, socket) {
  // Find and remove the member using their socket id
  const member = removeMember(socket.id)

  // Continue only if a member is found
  if (!member) { return }

  // TODO - display leaving message only when member leaves group
  const leavingText = `${member.username} has left the meeting...`
  const leavingMessage = formatMessage(BOT_NAME, leavingText)
  io.to(member.group).emit(SERVER_MESSAGE, leavingMessage)

  // Send the updated list of chat members to be rendered on the client
  io.to(member.group).emit('meetingInfo', {
    group: member.group,
    members: getAllMembers(member.group)
  })
}

// Returns a message object containing the member's username, text and timestamp
function formatMessage (username, text) {
  return {
    username: username,
    text: text
  }
}

module.exports = handleMeetingMember
