'use strict'

/* ------------------------------- CONSTANTS ------------------------------- */

const JOIN_CHAT_EVENT = 'joinChat'
const MESSAGE_EVENT = 'message'
const GROUP_INFO_EVENT = 'groupInfo'

/* ------------------------------ DOM Elements ------------------------------ */

const chatForm = document.getElementById('chat-form')

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

  const rating = document.getElementById('rate-members')
  loadRatingLink(rating)
})

function loadRatingLink (rating) {
  const a = document.createElement('a')
  const text = document.createTextNode('Rate Members')
  a.appendChild(text)
  a.setAttribute('class', 'btn')
  a.href = `/rating?group=${group}&username=${username}`
  // a.target = '_blank' // changes whether or not a new window is created
  rating.insertBefore(a, rating.childNodes[0])
}
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
  sendMessage(event, group, username, socket)
}, false)
