/* ------------------------------ Functionality ------------------------------ */

import { UserService } from './user-service'
import {
  loadButtons,
  loadHTMLTable
} from './load-meetings.js'
'use strict'

const { group } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})
const userService = UserService.getUserServiceInstance()
let currentUser = null
/* ------------------------------- CONSTANTS ------------------------------- */

const onlineButton = document.getElementById('choices')

/* ------------------------------ DOM Elements ------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
  const meeting = document.getElementById('choices')
  loadMeetingLink(meeting)
  loadButtons(meeting)
})

onlineButton.addEventListener('click', (event) => {
  if (event.target.dataset.id == 'faceMeet') {
    retrieveFaceMeetings()
  }
  if (event.target.dataset.id == 'onlineMeet') {
    // option for is_online = true
    retrieveOnlineMeetings(1)
  }
})

/* ------------------------------ Helper Functions ------------------------------ */

function loadMeetingLink (meeting) {
  const a = document.createElement('a')
  const text = document.createTextNode('Create a meeting')
  a.appendChild(text)
  a.setAttribute('class', 'btn btn-primary')
  a.href = `/choose-location?group=${group}`
  a.target = '_blank' // changes whether or not a new window is created
  meeting.insertBefore(a, meeting.childNodes[0])
}

function retrieveOnlineMeetings (option) {
  // include a statement if the user is not logged in - an alert prompts them to log in.
  userService.getCurrentUser().then(
    user => {
      // currentUser = user
      fetch('/onlineMeetings/' + group)
        .then(response => response.json())
        .then(data => {
          loadHTMLTable(data, option)
        })
    })
}

// Naive implementation to sort meeting records, only display the record
// if the user has passed the covid screen
// NOTE: this needs to be updated to include a time frame for the screening date
// and the meeting time
function retrieveFaceMeetings () {
  // include a statement if the user is not logged in - an alert prompts them to log in.
  userService.getCurrentUser().then(
    user => {
      currentUser = user
      const group_name = group
      const user_id = currentUser.id
      fetch(`/faceMeetings?group_name=${group_name}&user_id=${user_id}`)
        .then(response => response.json())
        .then(data => {
          viewFaceMeetings(data)
        })
    })
}
function viewFaceMeetings (data) {
  if (data.recordset.length === 0) {
    const table = document.querySelector('table tbody')
    table.innerHTML = "<tr><td class='no-data' colspan='5'>Please complete the covid screening to view the face to face meetings</td></tr>"
    return
  }
  if (data.recordset[0].passed == true) {
    console.log("You're clear")
    // option for is_online = false
    retrieveOnlineMeetings(0)
  }
}
