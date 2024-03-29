/* ------------------------------ Functionality ------------------------------ */
'use strict'
import { UserService } from '../user-service.js'
import { loadMeetingLink, createDirectionLink, removePlace } from './attend-meeting-helpers.js'
import { sendMessage } from './attend-meeting-messages.js'
import { calcDistance } from './distance.js'
// retrieve group name and meeting id from the URL
const { group, meetingID } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

// retrieve the current username
const userService = UserService.getUserServiceInstance()
let currentUser = null

// set the location settings to update the user location
let updateLocation = true
let timeIndex = 0

// set up socket stuff
const io = window.io
const SERVER_MESSAGE = 'Mmessage'
/* ------------------------------- CONSTANTS ------------------------------- */
const BASE_URL = 'https://maps.googleapis.com/maps/api/js?'
const API_KEY = 'AIzaSyCx_ZKS9QvVboI8DL_D9jDGA4sBHiAR3fU'

// Setting up map variables and marker array
let map = null
const gmarkers = []
const numChecks = 5 // checks if the user has been in the proximity for 5min

/* ------------------------------ DOM Elements ------------------------------ */

const chatForm = document.getElementById('chat-form')
const groupName = document.getElementById('group-name')
const messageArea = document.querySelector('.message-area')
const chatMembers = document.getElementById('chat-members')
const meeting = document.getElementById('group-name')
const meetingId = document.getElementById('meeting-id')
const sendLocation = document.getElementById('send-location')
const savedLocation = document.getElementById('saved-location')
const safeArrival = document.getElementById('safe-Arrival')
/* ------------------------------ DOM Elements ------------------------------ */

// does the user have a saved address
let savedAdress = true
// saves the user's saved address coordinates if applicable
let user_address_coords = null
// create the attendance client socket
const socket = io()
// Join the meeting
document.addEventListener('DOMContentLoaded', () => {
  meeting.innerText = group
  meetingId.innerText = meetingID
  getMeetingLink()

  let pos = null

  userService.getCurrentUser()
    .then(user => {
      currentUser = user
      const username = user.username
      createMapScript()
      getAddress(currentUser.id)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
            socket.emit('joinMeeting', { username, group, meetingID, position: pos })
          },
          function () {},
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        )
      }
    })
})

function getAddress (id) {
  fetch(`/get-address?user_id=${id}`)
    .then(response => response.json())
    .then(data => {
      // return data
      setUPAddress(data)
    })
}

function setUPAddress (data) {
  if (data.length === 0 || data[0].address_line_1 === ' ' || data[0].address_line_1 == null) {
    savedAdress = false
  }
  printSaved(savedAdress, data)
}

function printSaved (check, location) {
  if (check == true) {
    savedLocation.innerHTML = `Your safe destination is recorded as: ${formatLocation(location)}`
    // find and save the coordinate locations
    findCoordinates(formatLocation(location))
  } else if (check == false) {
    // const span = document.createElement('span')
    let text = document.createTextNode('You have no address saved, please click ')
    savedLocation.insertBefore(text, savedLocation.childNodes[0])

    safeArrival.setAttribute('class', 'btn btn-secondary')
    text = document.createTextNode('here')
    safeArrival.appendChild(text)

    text = document.createTextNode(' to indicate your safe arrival')
    savedLocation.appendChild(text)
  }
}

function convertJSONcoords (output) {
  user_address_coords = output.results[0].geometry.location
}

function findCoordinates (location) {
  return new Promise((resolve, reject) => {
    try {
      fetch(`get-coords?location=${location}`)
        .then(res => res.json())
        .then(data => {
          resolve(data)
          convertJSONcoords(data)
        })
    } catch (error) {
      reject(error)
    }
  })
}

function formatLocation (location) {
  return `${location[0].address_line_1}, ${location[0].address_line_2}, ${location[0].city}, ${location[0].postal_code}`
}

function getMeetingLink () {
  fetch(`/meetingLink?meeting_id=${meetingID}`)
    .then(response => response.json())
    .then(data => {
      loadMeetingLink(data)
    })
}

function createMapScript () {
  // Create the script tag, set the appropriate attributes
  const script = document.createElement('script')
  script.src = `${BASE_URL}key=${API_KEY}&callback=initMap`
  script.async = true
  // Append the 'script' element to 'head'
  document.head.appendChild(script)
};

window.initMap = function () {
  // map options
  const options = {
    zoom: 8,
    center: { lat: -26.1929, lng: 28.0305 }
  }
  // new map
  map = new google.maps.Map(document.getElementById('map'), options)
}
/* ------------------------------ Socket Events ------------------------------ */

// Run when a message from the SERVER is received
socket.on(SERVER_MESSAGE, message => {
  // display message
  const div = document.createElement('div')
  div.classList.add('message')
  div.innerHTML =
    `<p class="meta"> ${message.username} <span> ${message.time} </span></p>
     <p class="text">${message.text}</p>`
  messageArea.appendChild(div)

  // Automatically scroll down to the newly added message
  messageArea.scrollTop = messageArea.scrollHeight
})

// ***********************************
// Retrieve and render the group name, list of chat members and map markers
socket.on('meetingInfo', ({ group, members }) => {
  // display the group name
  groupName.innerText = group
  // load member names and links
  removePlace(chatMembers)
  members.map(member => loadMemberLink(member))
  // remove then add markers again.
  removeMarkers()
  members.map(member => addMarker({
    coords: { lat: member.position.lat, lng: member.position.lng },
    label: member.label,
    title: member.username
  }))
})

// ***********************************
// server asks for new position every few moments
// receive request to send new position
// send request for old position

// ask the server for the user's old position when server sends request
socket.on('news-by-server', () => {
  socket.emit('receivePosition')
})

// change to check whether their destination is either their home address or the meeting
// location. Can only be implemented once location accuracy has been improved.
socket.on('sendPosition', function (data) {
  // retrieve saved current user position from the server
  const oldPos = { lat: data.lat, lng: data.lng }

  let pos = null
  // only check/send for change in position if the user has elected to update their location
  // and there has not been two successive requests wherein the user position has remained the same
  if (timeIndex < numChecks && updateLocation == true) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          const accuracyCheck = position.coords.accuracy
          checkDistance(pos, oldPos, accuracyCheck)

          // request time will change to either every 5min or every 2min.
          if (timeIndex == 0) {
            socket.emit('changePosition', { newPosition: pos })
          } else if (timeIndex == numChecks) {
            // send a message to other members to say the current user has arrived if their
            // position is the same after 2 requests
            socket.emit('arrived', true)
            updateLocation = false
            sendLocation.setAttribute('class', 'btn btn-primary')
            sendLocation.innerHTML = 'Continue Sharing'
          }
        }
      )
    }
  }
})

function checkDistance (pos, oldPos, accuracyCheck) {
  // Check if the user is within the accuracy distance of their saved location
  // assuming 1km as the average accuracy if safe address is not provided
  let accuracy = 1000
  let pos2 = null
  if (savedAdress) {
    accuracy = accuracyCheck
    pos2 = user_address_coords
  } else {
    pos2 = oldPos
  }

  if (calcDistance(pos, pos2) < accuracy) {
    timeIndex++
  } else {
    timeIndex = 0
  }
}

/* ------------------------------ Event Listeners ------------------------------ */

document.getElementById('safe-Arrival').addEventListener('click', (event) => {
  updateLocation = false
  timeIndex = numChecks + 1 // setting to a value above numchecks
  sendLocation.setAttribute('class', 'btn btn-primary')
  sendLocation.innerHTML = 'Continue Sharing'
  socket.emit('arrived', true)
})

// Run when a message is sent
chatForm.addEventListener('submit', (event) => {
  sendMessage(event, group, currentUser.username, socket)
}, false)

// ***********************************
sendLocation.addEventListener('click', (event) => {
  if (updateLocation == false) {
    updateLocation = true // set updateLocation to true
    timeIndex = 0
    sendLocation.setAttribute('class', 'btn btn-secondary')
    sendLocation.innerHTML = 'Stop Sharing'
  } else {
    updateLocation = false
    timeIndex = numChecks + 1 // setting to a value above 2
    socket.emit('arrived', false) // stopped sharing their location
    sendLocation.setAttribute('class', 'btn btn-primary')
    sendLocation.innerHTML = 'Continue Sharing'
  }
})

/* ------------------------------ Helper Functions ------------------------------ */

// Add marker function
function addMarker (props) {
  if (typeof google === 'object' && typeof google.maps === 'object') {
    const marker = new google.maps.Marker({
      position: props.coords,
      label: props.label,
      // animation: google.maps.Animation.DROP, // too messy with multiple users
      title: props.title,
      map: map // map we want to add it to
    // icon: //set a new colour marker for every student - rather using labels
    })

    const infoWindow = new google.maps.InfoWindow()
    marker.addListener('click', function () {
      infoWindow.close()
      infoWindow.setContent(marker.getTitle())
      infoWindow.open(marker.getMap(), marker)
    })
    gmarkers.push(marker)
  }
}

// ***********************************
// remove all map markers
function removeMarkers () {
  for (let i = 0; i < gmarkers.length; i++) {
    gmarkers[i].setMap(null)
  }
  gmarkers.length = 0
}
// ***********************************
// add usernames to list and link map directions to the username
function loadMemberLink (member) {
  // create list element
  const li = document.createElement('li')
  li.setAttribute('data-cy', 'member-list')
  // create anchor element
  const a = document.createElement('a')
  a.innerHTML = `'${member.label}' - ${member.username}`
  a.setAttribute('class', 'btn')
  const URL = createDirectionLink(member.position)
  a.href = URL
  a.target = '_blank' // changes whether or not a new window is created
  li.appendChild(a)
  chatMembers.appendChild(li)
}

/* ---------------------------- STATIC LOCATION TESTING ---------------------------- */
// to show a position change
groupName.addEventListener('click', (event) => {
  const newPos = { lat: -25.2, lng: 28.2 }
  userService.getCurrentUser()
    .then(user => {
      currentUser = user
      const username = user.username
      socket.emit('changePosition', { username, group, meetingID, newPosition: newPos })
    })
})
