'use strict'
/* ------------------------------ Functionality ------------------------------ */
import { addAction } from '../action-log.js'
import { UserService } from '../user-service.js'
import { getMinimimumDestination, getUserDestination, getUniDestination } from '../recommend-locations.js'
import {
  loadLocation,
  loadPlatform
} from './load-meetings.js'
import { formatChatMessage, formatDatabaseMessage, recordMessage } from '../group-chat/chat-messages.js'

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
let meetingType = ''
const io = window.io
const socket = io()

// Update which meeting options should be displayed for the user
meetingChoice.addEventListener('change', (event) => {
  if (event.target.value === 'online') {
    loadPlatform()
    meetingType = 'online'
  }
  if (event.target.value === 'face-to-face') {
    loadLocation()
    meetingType = 'face-to-face'
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
  // initialise the variables
  let link = null
  let is_online = true
  let place = null
  // retrieve inputs from the different areas
  if (meetingChoice.value == 'none-selected') {
    window.alert('Please select a viable meeting option')
    return
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

      // Record the 'MEETING' action : TO DO: check if can add whether the meeting is online or face-to-face in description
      const time_made = moment()
      let format = 'face-to-face'
      if (is_online) { format = 'online' }
      let meetString = `${format} meeting for '${group}' has been set for <em>${moment(meeting_time).format('ddd, DD MMM YYYY')}</em> at <em>${moment(meeting_time).format('HH:mm')}</em> <br>
      <strong>Address</strong>:  <a href="${link}" target="_blank"> ${place} </a>`

      if (format === 'online') {
        meetString = `${format} meeting for '${group}' has been set for <em>${moment(meeting_time).format('ddd, DD MMM YYYY')}</em> at <em>${moment(meeting_time).format('HH:mm')}</em> <br>
        <strong>Platform</strong>: ${place} <br>
        <strong>Meeting Link</strong>: <a href="${link}" target="_blank"> HERE </a> `
      }

      // send meeting information to the group chat socket
      sendMessage(group, currentUser.username, new Date(meeting_time), socket)

      // log the meeting creation
      console.log('LOGGING IN PROCESS')
      addAction({ action: 'MEETING', groupName: group, timestamp: time_made, description: meetString })
    })

  // include a statement if the user is not logged in - an alert prompts them to log in.
})

// Sends the message to the other members in the chat and stores the message in the db
function sendMessage (group, user, meetingTime, socket) {
  // Build the chat message object
  const text = `A ${meetingType} meeting has been scheduled for ${meetingTime} by ${user}`

  const time = moment()
  const username = group
  const chatMessage = formatChatMessage(username, text, time)
  // Send the message to the server
  socket.emit('notification', { group: group, message: chatMessage })

  // Store the message in the database
  const databaseMessage = formatDatabaseMessage(group, user, text, time)
  recordMessage(databaseMessage)
}

// *********************************************************************************** //

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

/* ------------------ Get Recommended Locations ----------------------- */
function recommendCentralLocation () {
  getMinimimumDestination(group)
    .then(minAddress => {
      if (!minAddress) {
        window.alert('No group member has registered with an address')
        return
      }
      // Update the map once the address is found
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
      // Update the map once the address is found
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
