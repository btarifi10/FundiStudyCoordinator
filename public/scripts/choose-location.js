'use strict'
/* ------------------------------ Functionality ------------------------------ */

import { UserService } from './user-service.js'
import { getMinimimumDestination, getUserDestination, getUniDestination } from './recommend-locations.js'
import {
  loadLocation,
  loadPlatform,
  loadHTMLTable
} from './load-meetings.js'

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

// Update which meeting options should be displayed for the user
meetingChoice.addEventListener('change', (event) => {
  if (event.target.value === 'online') {
    loadPlatform()
  }
  if (event.target.value === 'face-to-face') {
    loadLocation()
  }
  if (event.target.value === 'none-selected') {
    window.alert('Please select a viable option')
  }
})

// Dynamically update the map based on the text input
document.querySelector('#place').addEventListener('input', function (event) {
  if (event.target.id == 'addressInput') {
    const mapFrame = document.getElementById('map')
    mapFrame.src = generateMapURL(event.target.value)
    const inputHelp = document.getElementById('location-hint')
    if (inputHelp) {
      if (!inputHelp.classList.contains('d-none')) { inputHelp.classList.add('d-none') }
      inputHelp.innerText = ''
    }
  }
})

// Send the form input to be added to the Database
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
  }
  // retrieve the current user id
  userService.getCurrentUser().then(
    user => {
      currentUser = user
      const group_name = group
      const creator_id = currentUser.id
      const meeting_time = document.getElementById('date').value
      const meetingBody = setUPMeeting(group_name, creator_id, meeting_time, place, link, is_online)
      recordMeeting(meetingBody)
    })
  // include a statement if the user is not logged in - an alert prompts them to log in.
})

// Set up the inputs to be placed into the database
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

// record the meeting to the database
function recordMeeting (meetingBody) {
  // console.log(meetingBody)
  fetch('/record-meeting', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(meetingBody)
  })
  window.alert('You have successfully created a Meeting')
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

  // // Create an anchor element with the URL
  // const a = document.createElement('a')
  // const text = document.createTextNode(`${address}`)
  // a.appendChild(text)
  // a.href = encodedURL
  // a.target = '_blank'

  // // Add it to the list
  // const li = document.createElement('li')
  // li.classList.add('list-group-item')
  // li.appendChild(a)
  // addressList.appendChild(li)
  return encodedURL
}

/* ------------------ Get Recommended Location ----------------------- */
function recommendCentralLocation () {
  getMinimimumDestination(group)
    .then(minAddress => {
      if (!minAddress) {
        window.alert('No group member has registered with an address')
        return
      }
      console.log(minAddress)
      document.getElementById('addressInput').value = minAddress.address
      const mapFrame = document.getElementById('map')
      mapFrame.src = generateMapURL(minAddress.address)
      const inputHelp = document.getElementById('location-hint')
      if (inputHelp) {
        if (inputHelp.classList.contains('d-none')) { inputHelp.classList.remove('d-none') }
        inputHelp.innerText = 'This address minimises the total distance travelled by group members'
      }
    })
}
window.recommendCentralLocation = recommendCentralLocation

function recommendUserLocation () {
  userService.getCurrentUser()
    .then(user => {
      currentUser = user
      return getUserDestination(group, currentUser.username)
    })
    .then(userAddress => {
      if (!userAddress) {
        window.alert('You have not registered with an address')
        return
      }
      document.getElementById('addressInput').value = userAddress.address
      const mapFrame = document.getElementById('map')
      mapFrame.src = generateMapURL(userAddress.address)
      const inputHelp = document.getElementById('location-hint')
      if (inputHelp) {
        if (inputHelp.classList.contains('d-none')) { inputHelp.classList.remove('d-none') }
        inputHelp.innerText = `${currentUser.firstName}'s address`
      }
    })
}
window.recommendUserLocation = recommendUserLocation

function recommendUniLocation () {
  const witsAddress = getUniDestination()
  document.getElementById('addressInput').value = witsAddress
  const mapFrame = document.getElementById('map')
  mapFrame.src = generateMapURL(witsAddress)
  const inputHelp = document.getElementById('location-hint')
  if (inputHelp) {
    if (inputHelp.classList.contains('d-none')) { inputHelp.classList.remove('d-none') }
    inputHelp.innerText = 'University of the Witwatersrand, Johannesburg'
  }
}
window.recommendUniLocation = recommendUniLocation
