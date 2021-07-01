/* ------------------------------ Functionality ------------------------------ */

import { UserService } from '../user-service.js'
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
  document.getElementById('back-button').href = `/chat?group=${group}`
})

onlineButton.addEventListener('click', (event) => {
  if (event.target.dataset.id == 'faceMeet') {
    retrieveFaceMeetings()
  }
  if (event.target.dataset.id == 'onlineMeet') {
    // option for is_online = true
    retrieveMeetings(1)
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

function retrieveMeetings (option) {
  // include a statement if the user is not logged in - an alert prompts them to log in.
  // currentUser = user
  fetch(`/getMeetings?group=${group}&option=${option}`)
    .then(response => response.json())
    .then(data => {
      loadHTMLTable(data, option)
    })
}

function retrieveFaceMeetings () {
  // include a statement if the user is not logged in - an alert prompts them to log in.
  userService.getCurrentUser().then(
    user => {
      currentUser = user
      const user_id = currentUser.id
      // order according to date passed
      fetch(`/faceMeetings?user_id=${user_id}`)
        .then(response => response.json())
        .then(data => {
          viewFaceMeetings(data)
        })
    })
}
function viewFaceMeetings (data) {
  if (data.recordset.length === 0) {
    const table = document.querySelector('table tbody')
    table.innerHTML = `<tr><td class='no-data' data-cy='empty-table-text' colspan='5'>
    Please complete the covid screening to view the face to face meetings <br>
    <a  class="btn btn-secondary" id='covid-reroute' href='covid-screening?group=${group}'>Click here to navigate to the covid screening page</a>
    </td></tr>`
    return
  }
  // currently grabbing the first result - this is the most recent result ordered by the query
  if (data.recordset[0].passed == false) {
    const table = document.querySelector('table tbody')
    table.innerHTML = '<tr><td class=\'no-data\' data-cy=\'empty-table-text\' colspan=\'5\'>In the last 72hours you have failed your most recent covid screening </td></tr>'
    return
  }
  // currently grabbing the first result
  if (data.recordset[0].passed == true) {
    retrieveMeetings(0)
  }
}
