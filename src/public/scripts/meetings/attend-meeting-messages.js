// Returns a message object containing the member's username, text and timestamp
function formatChatMessage (username, text, time) {
  return {
    username: username,
    text: text,
    time: moment(time).format('HH:mm')
  }
}

// Sends the message to the other members in the chat and stores the message in the db
function sendMessage (event, group, username, socket) {
  // Prevents default behaviour of submitting to a file
  event.preventDefault()

  // Build the chat message object
  const text = event.target.elements.msg.value
  const time = moment()
  const chatMessage = formatChatMessage(username, text, time)

  // Send the message to the server
  socket.emit('meetingMessage', chatMessage)

  // Clear and re-focus the text input (ready for the next message)
  event.target.elements.msg.value = ''
  event.target.elements.msg.focus()
}

export { sendMessage }
