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
  messageArea.scrollTop = messageArea.scrollHeight
})

// Run when a message is sent
chatForm.addEventListener('submit', (event) => {
  // Prevents default behaviour of submitting to a file
  event.preventDefault()

  // Retrieve the message from the text input
  const message = event.target.elements.msg.value

  // Send the message to the server
  socket.emit(CHAT_MESSAGE_EVENT, message)

  // Clear the text input from the chat form
  event.target.elements.msg.value = ''

  // Focus on the form again (ready for the next message)
  event.target.elements.msg.focus()
})

/* ---------------------------- Helper Functions ---------------------------- */

// Adds the formatted chat message to the DOM
function displayMessage (message) {
  const div = document.createElement('div')
  div.classList.add('message')
  div.innerHTML =
    `<p class="meta"> ${message.username} <span> ${message.time} </span></p>
     <p class="text">${message.text}</p>`
  document.querySelector('.message-area').appendChild(div)
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
