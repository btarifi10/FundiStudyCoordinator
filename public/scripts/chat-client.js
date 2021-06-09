'use strict'

/* ------------------------------- CONSTANTS ------------------------------- */

const JOIN_CHAT_EVENT = 'joinChat'
const MESSAGE_EVENT = 'message'
const CHAT_MESSAGE_EVENT = 'chatMessage'
const GROUP_INFO_EVENT = 'groupInfo'

/* ------------------------------ DOM Elements ------------------------------ */

const chatForm = document.getElementById('chat-form')
const messageArea = document.querySelector('.message-area')
const groupName = document.getElementById('group-name')
const chatMembers = document.getElementById('chat-members')

/* ------------------------------ Chat Service ------------------------------ */

// Retrieve the username and group name from the URL
const { username, group } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

// Once the DOM is loaded, display previous chat messages
document.addEventListener('DOMContentLoaded', () => {
  fetch(`/get-chat?group=${group}`)
    .then(response => response.json())
    .then(data => data.recordset)
    .then(displayChat)
})

// Create the client socket
const socket = io()

// Send a join request to the server
socket.emit(JOIN_CHAT_EVENT, { username, group })

// Retrieve and render the group name and list of chat members
socket.on(GROUP_INFO_EVENT, ({ group, members }) => {
  displayGroupName(group)
  displayChatMembers(members)
})

// Run when a message from the server is received
socket.on(MESSAGE_EVENT, message => {
  displayMessage(message)
})

// Run when a message is sent
chatForm.addEventListener('submit', (event) => {
  sendMessage(event)
})

/* ---------------------------- Helper Functions ---------------------------- */

// Displays existing chat history
function displayChat (messageEntries) {
  messageEntries.forEach(messageEntry => {
    const username = messageEntry.username
    let time = messageEntry.time_sent // .substring(11, 16)
    const text = messageEntry.text_sent

    /* ---- Temp solution ---- */

    time = moment(time).format('HH:mm')

    const message = {
      username: username,
      time: time,
      text: text
    }

    displayMessage(message)
  })
}

// Adds the formatted chat message to the DOM
function displayMessage (message) {
  const div = document.createElement('div')
  div.classList.add('message')
  div.innerHTML =
    `<p class="meta"> ${message.username} <span> ${message.time} </span></p>
     <p class="text">${message.text}</p>`
  document.querySelector('.message-area').appendChild(div)

  messageArea.scrollTop = messageArea.scrollHeight
}

// Adds the group name to the DOM
function displayGroupName (group) {
  groupName.innerText = group
}

// Adds the chat members list to the DOM
function displayChatMembers (members) {
  chatMembers.innerHTML = `
    ${members.map(member => `<li>${member.username}</li>`).join('')}
  `
}

function sendMessage (event) {
  // Prevents default behaviour of submitting to a file
  event.preventDefault()

  // Retrieve the text from the input
  const text = event.target.elements.msg.value

  // Send the message to the server
  socket.emit(CHAT_MESSAGE_EVENT, text)

  // Clear the text input from the chat form
  event.target.elements.msg.value = ''

  // Focus on the form again (ready for the next message)
  event.target.elements.msg.focus()

  // TODO - replace with formatting function
  const message = {
    group: group,
    username: username,
    text: text,
    time: moment().format()
  }

  // TODO - replace with function
  // Store the message in the db
  fetch('/record-message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(message)
  })
}
