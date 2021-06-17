/* ------------------------------ Functionality ------------------------------ */

import { UserService } from './UserService.js'
import {
  loadLocation,
  loadPlatform,
  loadHTMLTable
} from './load-meetings.js'
'use strict'

const { group } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})
const userService = UserService.getUserServiceInstance()
let currentUser = null
/* ------------------------------- CONSTANTS ------------------------------- */

// Embedded Map
const EMBED_BASE = 'https://www.google.com/maps/embed/v1/'
const MAP_MODE = 'place'
const API_KEY = 'AIzaSyCx_ZKS9QvVboI8DL_D9jDGA4sBHiAR3fU'
const DEFAULT_ADDRESS = ' '
const ZOOM = '13'

// URL Links
const URL_BASE = 'https://www.google.com/maps/'
const API_NUM = '1'

// Address regex
const ADDR_REGEX = /[^A-z0-9À-ž'.,\s+-º]+/g

/* ------------------------------ DOM Elements ------------------------------ */

const meetingForm = document.getElementById('meeting-form')
const addressList = document.getElementById('address-list')
const meetingChoice = document.getElementById('selection')
const viewMeetings = document.getElementById('View-btn')
// const creator_id = 9

// Update which meeting options should be displayed for the user
meetingChoice.addEventListener('change', (event) => {
  if (event.target.value == 'online') {
    loadPlatform()
  }
  if (event.target.value == 'face-to-face') {
    loadLocation()
  }
  if (event.target.value == 'none-selected') {
    window.alert('Please select a viable option')
  }
})

// Dynamically update the map based on the text input
document.querySelector('#place').addEventListener('input', function (event) {
  if (event.target.id == 'addressInput') {
    const mapFrame = document.getElementById('map')
    mapFrame.src = generateMapURL(event.target.value)
  }
})

// send query to retrieve group id and user id from the given information

// Naive implementation to illustrate the ability to view group meetings
viewMeetings.onclick = function () {
  fetch('/meetingViews/' + group)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      loadHTMLTable(data)
    })
}

meetingForm.addEventListener('submit', (event) => {
  event.preventDefault()
  let link = null
  let is_online = true
  let place = null
  // retrieve inputs from the different areas
  if (meetingChoice.value == 'none-selected') {
    window.alert('Please select a viable meeting option')
  } else if (meetingChoice.value == 'online') {
    link = document.getElementById('linkInput').value
    place = document.getElementById('platformInput').value
  } else if (meetingChoice.value == 'face-to-face') {
    link = createDirectionLink()
    place = document.getElementById('addressInput').value
    is_online = 0
    // console.log('do something - send information to database')
  }
  // retrieve the current user id
  userService.getCurrentUser().then(
    user => {
      currentUser = user
      // retrieve the group id corresponding to the group name
      // fetch('/meetingGroup/' + group)
      // .then(response => response.json())
      // .then(data => {
      const group_name = group
      // const group_id = data.recordset[0].group_id
      // console.log(group_id)
      const creator_id = currentUser.id
      const meeting_time = document.getElementById('date').value
      const meetingBody = setUPMeeting(group_name, creator_id, meeting_time, place, link, is_online)
      recordMeeting(meetingBody)
      // }
      // )
    })
})

function setUPMeeting (group_name, creator_id, meeting_time, place, link, is_online) {
  return {
    group_name: group_name,
    creator_id: creator_id,
    meeting_time: new Date(meeting_time), // check how the conversions are being made to the database
    place: place,
    link: link,
    is_online: is_online
  }
}

function recordMeeting (meetingBody) {
  console.log(meetingBody)
  fetch('/record-meeting', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(meetingBody)
  })
}
/* ---------------------------- Helper Functions ---------------------------- */

function generateMapURL (address) {
  // Remove invalid characters
  const validAddress = address.replace(ADDR_REGEX, '')

  let URL = ''

  // If the resulting string is empty, use the default address
  if (validAddress === '') {
    URL = `${EMBED_BASE}${MAP_MODE}?key=${API_KEY}&q=${DEFAULT_ADDRESS}&zoom=${ZOOM}`
  } else {
    URL = `${EMBED_BASE}${MAP_MODE}?key=${API_KEY}&q=${validAddress}&zoom=${ZOOM}`
  }

  // Encode the URL before returning it
  return encodeURI(URL)
}

/* -- Convert submitted address to Google Map link -- */
function createDirectionLink () {
// Build a valid URL
  const address = document.getElementById('addressInput').value
  // const address = event.target.elements.addressInput.value
  const URL = `${URL_BASE}dir/?api=${API_NUM}&destination=${address}`
  const encodedURL = encodeURI(URL)

  // Create an anchor element with the URL
  const a = document.createElement('a')
  const text = document.createTextNode(`${address}`)
  a.appendChild(text)
  a.href = encodedURL
  a.target = '_blank'

  // Add it to the list
  const li = document.createElement('li')
  li.classList.add('list-group-item')
  li.appendChild(a)
  addressList.appendChild(li)
  return encodedURL
}
// Extra listener to use to test input stuff - remove
// document.querySelector('#meeting-date').addEventListener('input', function (event) {
//   if (event.target.id == 'date') {
//     const date = document.getElementById('date').value
//     const dt = new Date(date)
//     console.log(group)
//     userService.getCurrentUser().then(
//       user => {
//         currentUser = user
//         console.log(currentUser.id)
//       })
//   }
// })
