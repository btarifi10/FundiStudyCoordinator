'use strict'

/* -------------------------------- Imports -------------------------------- */

import { UserService } from '../UserService.js'
import { sendMessage } from './chat-messages.js'
import {
  displayChat,
  displayGroupName,
  displayChatMembers,
  displayMessage
} from './chat-display.js'

const io = window.io

/* ------------------------------- CONSTANTS ------------------------------- */

const JOIN_CHAT_EVENT = 'joinChat'
const MESSAGE_EVENT = 'message'
const GROUP_INFO_EVENT = 'groupInfo'

/* ------------------------------ DOM Elements ------------------------------ */

const chatForm = document.getElementById('chat-form')

/* ------------------------------ Chat Service ------------------------------ */

// Create the client socket
const socket = io()

// Retrieve the group name from the URL
const { group } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

// Retrieve the current username
let currentUser = null
const userService = UserService.getUserServiceInstance()
userService.getCurrentUser()
  .then(user => {
    currentUser = user
    const username = user.username
    socket.emit(JOIN_CHAT_EVENT, { username, group })
  })

// Once the DOM is loaded, display previous chat messages
document.addEventListener('DOMContentLoaded', () => {
  fetch(`/get-chat?group=${group}`)
    .then(response => response.json())
    .then(data => data.recordset)
    .then(displayChat)
})

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
  sendMessage(event, group, currentUser.username, socket)
}, false)
