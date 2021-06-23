/* ------------------------------ Functionality ------------------------------ */
'use strict'
import { UserService } from '../user-service.js'
import { sendMessage } from './attend-meeting-messages.js'
// retrieve group name and meeting id from the URL
const { group, meetingID } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

// retrieve the current username
const userService = UserService.getUserServiceInstance()
let currentUser = null

let updateLocation = false
const io = window.io
/* ------------------------------- CONSTANTS ------------------------------- */
const BASE_URL = 'https://maps.googleapis.com/maps/api/js?'
const API_KEY = 'AIzaSyCx_ZKS9QvVboI8DL_D9jDGA4sBHiAR3fU'
let map = null

const SERVER_MESSAGE = 'Mmessage'
const gmarkers = []
/* ------------------------------ DOM Elements ------------------------------ */

const chatForm = document.getElementById('chat-form')
const groupName = document.getElementById('group-name')
const messageArea = document.querySelector('.message-area')
const chatMembers = document.getElementById('chat-members')
const meeting = document.getElementById('group-name')
const meetingId = document.getElementById('meeting-id')
const sendLocation = document.getElementById('send-location')

/* ------------------------------ DOM Elements ------------------------------ */

// create the attendance client socket
const socket = io()
// Join the meeting
document.addEventListener('DOMContentLoaded', () => {
  createMapScript()
  console.log(group)
  console.log(meetingID)
  meeting.innerText = group
  meetingId.innerText = meetingID
  let pos = null
  userService.getCurrentUser()
    .then(user => {
      currentUser = user
      const username = user.username
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
            socket.emit('joinMeeting', { username, group, meetingID, position: pos })
            // socket.emit('marker', pos)
          }
        )
      }
    })
})

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
// socket.on('marker', data => {
//   const posLat = data.lat
//   const posLng = data.lng
//   const marker = addMarker({
//     coords: { lat: posLat, lng: posLng },
//     label: 'M',
//     title: 'Marker-username'
//   })
// })
// ***********************************
// Retrieve and render the group name and list of chat members
// also markers
socket.on('meetingInfo', ({ group, members, markers }) => {
  // display the group name
  groupName.innerText = group

  removeMarkers()
  chatMembers.innerHTML = `
    ${members.map(member => `<li><a onclick="updateMap('${member.position}')">${member.label} - ${member.username}</a></li>`).join('')}
  `
  // markers.map(marker => addMarker({ coords: { lat: marker.lat, lng: marker.lng } }))
  members.map(member => addMarker({
    coords: { lat: member.position.lat, lng: member.position.lng },
    label: member.label,
    title: member.username
  }))
})
// ***********************************
function removeMarkers () {
  for (let i = 0; i < gmarkers.length; i++) {
    gmarkers[i].setMap(null)
  }
  gmarkers.length = 0
}

let i = 0
// ***********************************
socket.on('news-by-server', function (data) {
  // alert(data)
  // when receiving message from server, update location and send back
  const newPos = { lat: -25.2, lng: 28.2 }
  userService.getCurrentUser()
    .then(user => {
      currentUser = user
      const username = user.username
      let pos = null

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
            console.log(i++)
            socket.emit('changePosition', { username, group, meetingID, newPosition: pos })
          }
        )
      }
    })
})

/* ------------------------------ Event Listener ------------------------------ */

// Run when a message is sent
chatForm.addEventListener('submit', (event) => {
  sendMessage(event, group, currentUser.username, socket)
}, false)

// ***********************************
sendLocation.addEventListener('click', (event) => {
  if (updateLocation == false) {
    updateLocation = true // set updateLocation to true
    // CHANGE THE COLOUR OF THE BUTTON TOO!
    sendLocation.setAttribute('class', 'btn btn-secondary')
  } else {
    updateLocation = false
    sendLocation.setAttribute('class', 'btn btn-primary')
  }

  addMarker({
    coords: { lat: -26.0324, lng: 28.0742 }, label: 'label', title: 'username'
  }) // for each member add the marker
  addMarker({
    coords: { lat: -26.05, lng: 28.1 }, label: 'label', title: 'username'
  })

  if (updateLocation == true) {
    console.log('I am executing')
    setInterval(myTimer(), 10000)
    window.setTimeout(myTimer(), 5000)
  }
})
// ***********************************
groupName.addEventListener('click', (event) => {
  const newPos = { lat: -25.2, lng: 28.2 }
  userService.getCurrentUser()
    .then(user => {
      currentUser = user
      const username = user.username
      socket.emit('changePosition', { username, group, meetingID, newPosition: newPos })
      // socket.emit('marker', newPos) // check if this is working preoperly
    })
})

/* ------------------------------ Helper Functions ------------------------------ */
// Flickers each time a user resends their location
// Nice if we could make it so that it only uses the drop when the user first joins.
// Add marker function
function addMarker (props) {
  // either populate markers everytime from the member array stuff
  // or make a unique ID which we remove each time
  // let markerID = getMarkerUniqueId(props.coords.lat, props.coords.lng)
  const marker = new google.maps.Marker({
    position: props.coords,
    label: props.label, // 'tazzymagglesinhfsd', // labels[labelIndex++ % labels.length],
    // animation: google.maps.Animation.DROP, // too messy with multiple users
    title: props.username,
    map: map // map we want to add it to
    // icon: //set a new colour marker for every student
  })

  const username = 'try-this'
  const infoWindow = new google.maps.InfoWindow()
  marker.addListener('click', function () {
    infoWindow.close()
    infoWindow.setContent(marker.getTitle())
    infoWindow.open(marker.getMap(), marker)
  })
  gmarkers.push(marker)
}
// ***********************************
let intCheck = 1
function myTimer () {
  console.log(intCheck++)
}
// ***********************************
// I think i need to do this with the SERVER side rather, since the info is served in the server
window.updateMap = updateMap
function updateMap (newPosition) {
  console.log(newPosition)
  console.log(newPosition.lat)
  console.log(newPosition.lng)
  // const posString = `${newPosition.lat},${newPosition.lng}`
  // console.log(posString)
  // const mapEle = document.getElementById('map')
  // const destination = `https://www.google.com/maps/embed/v1/place?key=AIzaSyCx_ZKS9QvVboI8DL_D9jDGA4sBHiAR3fU&q=${posString}`
  // mapEle.setAttribute('src', destination)
}
/* ----------------------------- Main Functions ----------------------------- */

// function getPosition () {
//   let pos = null
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         pos = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude
//         }
//         console.log(pos)
//         return pos
//       }
//     )
//   }
//   // else {
//   pos = { lat: 0, lng: 0 }
//   return pos
//   // }
// }

/*
This shows the alert box every 3 seconds:
setInterval(function(){alert("Hello")},3000);

setInterval(): executes a function, over and over again, at specified time intervals
setTimeout() : executes a function, once, after waiting a specified number of milliseconds

Execute function FetchData() once after 1000 milliseconds:

setTimeout(FetchData,1000);
Execute function FetchData() repeatedly every 1000 milliseconds:

setInterval(FetchData,1000);

https://www.w3schools.com/js/js_timing.asp

*/
