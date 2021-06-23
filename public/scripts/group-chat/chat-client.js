'use strict'

/* -------------------------------- Imports -------------------------------- */

import { UserService } from '../user-service.js'
import { sendMessage } from './chat-messages.js'
import {
  displayChat,
  displayGroupName,
  displayChatMembers,
  displayMessage
} from './chat-display.js'
import { addAction } from '../action-log.js'

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

// Once the DOM is loaded, display previous chat messages
document.addEventListener('DOMContentLoaded', () => {
  const meeting = document.getElementById('meetings')
  loadMeetingLink(meeting)
  fetch(`/get-chat?group=${group}`)
    .then(response => response.json())
    .then(data => data.recordset)
    .then(displayChat)

  userService.getCurrentUser()
    .then(user => {
      currentUser = user
      const username = user.username
      socket.emit(JOIN_CHAT_EVENT, { username, group })
      const rating = document.getElementById('rate-members')
      loadRatingLink(rating)

      // Record user's entry into the groupchat
      const time_entered = moment()
      addAction({ action: 'ENTER', groupName: group, timestamp: time_entered, description: `${username} entered ${group}` })
    })
  const linkGroupPolls = document.getElementById('link-group-polls')
  linkGroupPolls.href = `polls?group=${group}`
})

function loadRatingLink (rating) {
  const a = document.createElement('a')
  const text = document.createTextNode('Rate Members')
  a.appendChild(text)
  a.setAttribute('class', 'btn')

  const username = currentUser.username
  a.href = `/rating?group=${group}&username=${username}`
  // a.target = '_blank' // changes whether or not a new window is created
  rating.insertBefore(a, rating.childNodes[0])
}

// this may be altered to include an option for

function loadMeetingLink (meeting) {
  const a = document.createElement('a')
  const text = document.createTextNode('Create Meetings')
  a.appendChild(text)
  a.setAttribute('class', 'btn')
  a.href = `/choose-location?group=${group}`
  // a.target = '_blank' // changes whether or not a new window is created
  meeting.insertBefore(a, meeting.childNodes[0])

  const a2 = document.createElement('a')
  const text2 = document.createTextNode('Meetings')
  a2.appendChild(text2)
  a2.setAttribute('class', 'btn')
  a2.href = `/meetings?group=${group}`
  // a.target = '_blank' // changes whether or not a new window is created
  meeting.insertBefore(a2, meeting.childNodes[0])
}

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

window.onbeforeunload = function () {
  userService.getCurrentUser()
    .then(user => {
      // Record user's exit from the groupchat
      const username = user.username
      const time_left = moment()
      addAction({ action: 'LEAVE', groupName: group, timestamp: time_left, description: `${username} left ${group}` })
    })
}
