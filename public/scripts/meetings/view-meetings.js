/* ------------------------------ Functionality ------------------------------ */

import { UserService } from '../user-service.js'
import {
  loadButtons,
  getTimeRemaining
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
    table.innerHTML = "<tr><td class='no-data' data-cy='empty-table-text' colspan='5'>Please complete the covid screening to view the face to face meetings</td></tr>"
    return
  }
  // currently grabbing the first result - this is the most recent result ordered by the query
  if (data.recordset[0].passed == false) {
    const table = document.querySelector('table tbody')
    table.innerHTML = "<tr><td class='no-data' data-cy='empty-table-text' colspan='5'>In the last 72hours you have failed your most recent covid screening</td></tr>"
    return
  }
  // currently grabbing the first result
  if (data.recordset[0].passed == true) {
    console.log("You're clear")
    retrieveMeetings(0)
  }
}

// ------------ from load-meetings.js -----------

function loadHTMLTable (data, option) {
  const table = document.querySelector('table tbody')
  if (data.recordset.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='5'>No meetings</td></tr>"
    return
  }

  let headings = ''
  headings += '<thead>'
  headings += '<th>Meeting ID</th>'
  headings += '<th>Group Name</th>'
  headings += '<th>creator id</th>'
  headings += '<th>Meeting Time</th>'
  headings += '<th>Place/Location</th>'
  headings += '<th>Time Remaining</th>'
  headings += '</thead>'

  let tableHtml = ''
  tableHtml += headings

  data.recordset.forEach(function ({ meeting_id, group_name, creator_id, meeting_time, place, link, is_online }) {
    meeting_time = new Date(meeting_time)
    // retrieve time remaining until the meeting in days
    const current_time = new Date()
    let sign = ' '
    const remaining = getTimeRemaining(meeting_time, current_time)
    if (meeting_time.getTime() - current_time.getTime() < 0) {
      sign = '-'
    }

    tableHtml += '<tr>'
    tableHtml += `<td data-cy='meeting-id-${meeting_id}' id='${meeting_id}-meeting-id'>${meeting_id}</td>`
    tableHtml += `<td data-cy='meeting-group-${meeting_id}' id='${meeting_id}-meeting-group-name'>${group_name.trim()}</td>`
    tableHtml += `<td data-cy='creator-id-${meeting_id}' id='${meeting_id}-creator-id'>${creator_id}</td>`
    tableHtml += `<td data-cy='meeting-time-${meeting_id}' id = '${meeting_id}-meeting-time'>${moment(meeting_time).format('ddd, DD MMM YYYY HH:mm')}</td>`
    tableHtml += `<td data-cy='meeting-place-${meeting_id}' id = '${meeting_id}-place'><a href=${link} target='_blank'>${place}</a></td>`
    if (option == 0) {
      tableHtml += `<td id = '${meeting_id}-time-diff'>
      ${sign}${remaining.days}days ${remaining.hours}hours ${remaining.minutes}minutes ${remaining.seconds}seconds
      <br><button class = "btn btn-secondary" id="attend-${meeting_id}-btn" data-cy='attend-meeting-${meeting_id}-btn' data-id='attend-${meeting_id}-btn' 
      onclick="move(${meeting_id})"> Attend</button></td>`
    } else {
      tableHtml += `<td id = '${meeting_id}-time-diff'>
      ${sign}${remaining.days}days ${remaining.hours}hours ${remaining.minutes}minutes ${remaining.seconds}seconds</td>`
    }
    tableHtml += '</tr>'
  })
  table.innerHTML = tableHtml
}

window.move = move
function move (meeting_id) {
  if (confirm('Do you wish to attend the meeting? Please note that your location or information shared in the chat will not be saved')) {
    const URL = `/attend-meeting?group=${group}&meetingID=${meeting_id}`
    window.open(URL, '_blank') || window.location.replace(URL)
  }
}
