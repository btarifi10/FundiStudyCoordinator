/* ------------------------------ Description ----------------------------------
This file contains the functions concerned with formatting, sending and storing
the chat messages sent within a group
*/

/* -------------------------------- Imports -------------------------------- */

const moment = window.moment

/* ------------------------------- CONSTANTS ------------------------------- */

const CHAT_MESSAGE_EVENT = 'chatMessage'

/* ----------------------------- Main Functions ----------------------------- */

// Sends the message to the other members in the chat and stores the message in the db
function sendMessage (event, group, username, socket) {
  // Prevents default behaviour of submitting to a file
  event.preventDefault()

  // Build the chat message object
  const text = event.target.elements.msg.value
  const time = moment()
  const chatMessage = formatChatMessage(username, text, time)

  // Send the message to the server
  socket.emit(CHAT_MESSAGE_EVENT, chatMessage)

  // Clear and re-focus the text input (ready for the next message)
  event.target.elements.msg.value = ''
  event.target.elements.msg.focus()

  // Store the message in the database
  const databaseMessage = formatDatabaseMessage(group, username, text, time)
  recordMessage(databaseMessage)
}

// Returns a message object containing the member's username, text and timestamp
function formatChatMessage (username, text, time) {
  return {
    username: username,
    text: text,
    time: moment(time).format('HH:mm')
  }
}

/* ---------------------------- Helper Functions ---------------------------- */

// Returns a message object containing the member's group, username, text and timestamp
function formatDatabaseMessage (group, username, text, time) {
  return {
    group: group,
    username: username,
    text: text,
    time: moment(time).format()
  }
}

// Sends the message to the server, which in turn stores it in the database
function recordMessage (databaseMessage) {
  fetch('/record-message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(databaseMessage)
  })
}

export {
  sendMessage,
  formatChatMessage,
  formatDatabaseMessage,
  recordMessage
}
