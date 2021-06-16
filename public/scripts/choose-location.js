'use strict'

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

const addressInput = document.getElementById('addressInput')
const mapFrame = document.getElementById('map')
const meetingForm = document.getElementById('meeting-form')
const addressList = document.getElementById('address-list')

/* ------------------------------ Functionality ------------------------------ */

// Dynamically update the map based on the text input
addressInput.addEventListener('input', (event) => {
  mapFrame.src = generateMapURL(event.target.value)
})

/*
Convert submitted address to Google Map link

NOTE: I have not bothered to extract this behaviour into a separate function
since this merely serves as an example/guide on how to convert a text address
into a clickable Google Maps Link. I assume it will be used when displaying the
meeting info. Note that I have already imposed limits on the characters that
can be submitted in the form by using in the text input html tag for the
address (see below), and so this need not be checked here.

required pattern="[A-z0-9À-ž'.,\s+-º]+"

*/
meetingForm.addEventListener('submit', (event) => {
  event.preventDefault()

  // Build a valid URL
  const address = event.target.elements.addressInput.value
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
})

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
